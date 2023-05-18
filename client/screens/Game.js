import {
  StyleSheet,
  View,
  TouchableOpacity,
  Button,
  Text,
  Platform,
} from 'react-native';
import Constants from 'expo-constants';
import { useState, useEffect, useRef } from 'react';
import * as Location from 'expo-location';
import * as Haptics from 'expo-haptics';

import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

import { getGameRoom, lobbyRoom } from '../networking.js';
import { findDistance, distAll, findClosest } from '../utils.js';
import * as taskUtils from '../tasks-utils.js';

import Minimap from '../components/minimap.js';
import ControlPanel from '../components/controlpanel.js';

import CaptchaTask from '../components/tasks/recaptcha.js';
import CodeTask from '../components/sabotage/passcode.js';
import MemoryTask from '../components/tasks/memory.js';
import ElectricityTask from '../components/tasks/electricity.js';

import CustomText from '../components/text.js';
import SabotageFlash from '../components/flash.js';
import VotingModal from '../components/voting.js';
import { ProfileIcon } from '../components/profile-icon.js';
import { TaskIcon } from '../components/task-icon.js';

var mapView;
let manualMovementVar; // !! HACK !! React state sucks

export default function GameScreen({ navigation }) {
  //TESTING
  const [manualMovement, setManualMovement] = useState(false);
  const setManualMovementHook = (value) => {
    setManualMovement(value); // This is terrible :( why must React be like this
    manualMovementVar = value;
  };

  //// HOOKS

  //SABOTAGE, EMERGENCY MEETING AND VOTING HOOKS
  const [sabotageActive, setSabotageActive] = useState(false);
  const [sabNotif, setSabNotif] = useState(false);
  const [emergencyMeetingLocation, setEmergencyMeetingLocation] = useState({
    latitude: 0,
    longitude: 0,
  });
  const [votingModalVisible, setVotingModalVisible] = useState(false);
  const [votingTimer, setVotingTimer] = useState(-1); // Now dynamically changes!

  //BUTTON HOOKS
  const [disableActions, setDisableActions] = useState(false);
  const [buttonState, setButtonState] = useState({
    use: true, // These should all be true at the beginning of the game
    report: true,
    kill: true,
    disguise: false,
    sabotage: false,
  });

  //TASK HOOKS
  const [taskCompletion, setTaskCompletion] = useState(0);
  const [activeTask, setActiveTask] = useState({
    name: null,
    taskId: null,
  });
  const [distTask, setDistTask] = useState([]);
  const [tasks, setTasks] = useState([]); // array of the locations of all tasks applicable to the user, will also be marked on the minimap

  //PLAYER HOOKS
  const [location, setLocation] = useState({
    latitude: 0,
    longitude: 0,
  });
  const [playerState, setPlayerState] = useState('impostor');
  const [players, setPlayers] = useState([]); // At some point, we'll want to use a state management lib for this
  const [player, setPlayer] = useState(); // Player state, continually updated by server (for convenience)
  const [distPlayer, setDistPlayer] = useState([]);

  //REFRESH HOOK
  const [refresh, setRefresh] = useState(0); // "Refresh" state to force rerenders

  //// FUNCTIONS

  //SABOTAGE, EMERGENCY MEETING AND VOTING FUNCTIONS
  function sabotage(type) {
    getGameRoom().send(type);
    setSabotageActive(true);
  }
  const openVotingModal = () => {
    const room = getGameRoom();
    if (!room) return;

    if (room.state.gameState !== 'voting') {
      // If this is triggered manually
      room?.send('startVoting');
    }

    setVotingModalVisible(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  };

  //BUTTON FUNCTIONS
  function changeButtonState(button, state) {
    setButtonState((prevButtonState) => ({
      ...prevButtonState,
      [button]: state,
    }));
  }
  function useButton() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    let closestTask = findClosest(distTask);
    if (
      !closestTask.complete &&
      (playerState == 'crewmate' ||
        (playerState == 'impostor' &&
          sabotageActive &&
          closestTask.name === 'o2'))
    ) {
      setActiveTask((prevArrState) => ({
        ...prevArrState,
        name: closestTask.name,
        taskId: closestTask.taskId,
      }));
    }
  }
  function reportButton() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    getGameRoom().send('callEmergency', location);
  }
  function killButton() {
    let closestPlayer = findClosest(distPlayer);
    console.log(closestPlayer.sessionId);
    getGameRoom().send('playerDeath', closestPlayer.sessionId);
  }
  function disguiseButton() {
    setPlayerState('disguised');
  }
  function revealButton() {
    setPlayerState('impostor');
  }
  function activateUseButton() {
    if (distTask.length > 0) {
      if (playerState == 'crewmate') {
        changeButtonState('use', false);
        if (buttonState.use === true) {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        }
      } else if (
        playerState == 'impostor' &&
        findClosest(distTask).name == 'o2'
      ) {
        changeButtonState('use', false);
      }
    } else {
      changeButtonState('use', true);
    }
  }
  function activateKillButton() {
    if (playerState == 'impostor') {
      changeButtonState(
        'kill',
        !(distPlayer.filter((p) => p.isAlive).length > 0)
      );
    }
  }
  function activateReportButton() {
    changeButtonState(
      'report',
      !(distPlayer.filter((p) => !p.isAlive).length > 0)
    );
  }

  //TASK FUNCTIONS
  const taskMarkers = () => taskUtils.taskMarkers(tasks);
  const completeTask = () =>
    taskUtils.completeTask(activeTask, setActiveTask, getGameRoom);
  const closeTask = () => taskUtils.closeTask(setActiveTask);

  //PLAYER AND TASK LOCATION
  const setLocationHook = (loc) => {
    //for testing only
    if (manualMovementVar) return;
    //
    getGameRoom()?.send('location', loc);
    setLocation(loc);
  };
  const animate = (loc) => {
    let r = {
      latitude: loc.latitude,
      longitude: loc.longitude,
      latitudeDelta: 0.001,
      longitudeDelta: 0.001,
    };
    mapView?.animateToRegion(r, 500);
  };
  function findAllDist(loc) {
    let taskDist = distAll('task', loc, tasks, 20);
    let playerArr = players.filter(
      (p) => p.sessionId !== getGameRoom().sessionId
    );
    let playerDist = distAll(
      'player',
      loc,
      playerArr,
      getGameRoom().state.settings.killRadius
    );
    setDistTask(taskDist);
    setDistPlayer(playerDist);
  }

  //PLAYER STATE
  function deathScreen() {
    if (player && !player.isAlive) {
      return (
        <View style={styles.deathScreen}>
          <CustomText
            numberOfLines={1}
            textSize={80}
            letterSpacing={3}
            textColor={'white'}
          >
            You Are Dead
          </CustomText>
        </View>
      );
    }
  }

  //// USEEFFECTS

  //PLAYER AND TASK LOCATION
  useEffect(() => {
    // Location update loop

    // This is a listener that gets removed when the component unmounts
    let locationWatcher;

    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        return;
      }

      // Initial location update
      let newLocation = await Location.getCurrentPositionAsync({});
      // Necessary hook to send update to server
      // ("Hook" might be an inaccurate term)
      // See definition at top of this file
      setLocationHook(newLocation.coords);

      // Continued location update
      locationWatcher = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          distanceInterval: 0.1,
          timeInterval: 10,
        },
        (loc) => {
          setLocationHook(loc.coords);
        }
      );
    })();

    return async () => {
      // Unmount listener when component unmounts
      // TODO: dev setting, uncomment when done
      await locationWatcher?.remove();
    };
  }, []);
  useEffect(() => {
    // Detects when distTask is updated and reevaluates USE button activation
    activateUseButton();
  }, [distTask]);
  useEffect(() => {
    // Detects when distPlayer is updated and reevaluates KILL button activation
    activateKillButton();
    activateReportButton();
  }, [distPlayer]);
  useEffect(() => {
    findAllDist(location);
  }, [location]);
  useEffect(() => {
    findAllDist(location);
  }, [
    JSON.stringify(
      players.filter((p) => p.sessionId !== getGameRoom().sessionId)
    ),
  ]);

  //SABOTAGE
  useEffect(() => {
    if (activeTask.taskId === sabNotif) {
      closeTask();
    }
  }, [sabNotif]);

  //SERVER STUFF
  useEffect(() => {
    // Networking update loop
    const room = getGameRoom();

    setPlayers(room?.state?.players);

    const thisPlayer = room.state.players.find(
      (p) => p.sessionId === room.sessionId
    );
    setPlayerState(thisPlayer.isImpostor ? 'impostor' : 'crewmate');

    room.onMessage('startVoting', () => {
      openVotingModal();
    });

    room.onMessage('playerKilled', (playerId) => {
      console.log(`Player ${playerId} was voted out`);
    });

    room.onMessage('sabotage', () => {
      setSabotageActive(true);
    });

    room.onMessage('sabotageOver', () => {
      setSabotageActive(false);
    });

    room.onMessage('task complete', (taskId) => {
      setSabNotif(taskId);
    });

    room.onMessage('endedGame', (message) => {
      if (message == 'impostor') {
        return (
          <View style="gameEnded">
            <Text>Impostors won!</Text>
          </View>
        );
      } else if (message == 'crewmate') {
        return (
          <View style="gameEnded">
            <Text>Crewmates won!</Text>
          </View>
        );
      }
    });

    room.onStateChange((state) => {
      setPlayers(state.players);
      setPlayer();

      const player = state.players.find(
        (player) => player.sessionId === getGameRoom().sessionId
      );
      setPlayer(player);
      setTasks(player.tasks);

      // Animate to new given location and update local state
      setLocation({ ...player.trueLocation }); // VERY IMPORTANT to make new object here, or useEffect will not fire
      animate(player.trueLocation);

      // Set emergency meeting location, if applicable
      setEmergencyMeetingLocation({ ...state.emergencyMeetingLocation });
      setDisableActions(state.emergencyMeetingLocation.latitude !== 0);

      // Voting stuff
      setVotingTimer(state.votingTimer);
      setVotingModalVisible(room.state.gameState === 'voting');

      // Set progress bar based on task completion percentage
      // Array.reduce documentation: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce
      const totalTaskCount = state.players.reduce(
        (count, player) =>
          count + player.isImpostor ? 0 : player.tasks.length,
        0
      );
      const completedTaskCount = state.players.reduce(
        (count, player) =>
          count + player.isImpostor
            ? 0
            : player.tasks.reduce((count, task) => count + task.complete, 0),
        0
      );
      setTaskCompletion(completedTaskCount / totalTaskCount);

      // Force rerender
      setRefresh((value) => value + 1);
    });

    return () => {
      room.removeAllListeners();
    };
  }, []);

  return (
    <View style={styles.container}>
      {/* !! HACKY STUFF!! Force rerenders with this state */}
      <View style={{ display: 'none' }}>
        <CustomText>
          {refresh}
          {manualMovement}
          {location.longitude}
        </CustomText>
      </View>

      {/* MAIN MAP */}
      <MapView
        ref={(ref) => (mapView = ref)}
        style={styles.map}
        pitchEnabled={false}
        rotateEnabled={false}
        scrollEnabled={false}
        zoomEnabled={false}
        initialRegion={{
          latitude: 47.7326514,
          longitude: -122.3278194,
          latitudeDelta: 0.002,
          longitudeDelta: 0.002,
        }}
        // Changed from satellite for android for performance
        mapType={Platform.OS === 'ios' ? 'standard' : 'standard'}
        moveOnMarkerPress={false}
      >
        {/* PLAYER MARKERS */}
        {players.map((p) => {
          let displayLoc =
            p?.isAlive || p.sessionId === getGameRoom().sessionId
              ? p.trueLocation
              : p.location;

          return (
            <Marker
              tracksViewChanges={p.isAlive}
              key={p.sessionId}
              coordinate={{ ...displayLoc }}
              title={p.username}
            >
              <ProfileIcon
                player={p} // Pass the whole player object
                size={40}
              />
            </Marker>
          );
        })}

        {/* EMERGENCY MEETING */}
        {emergencyMeetingLocation && (
          <Marker
            key="Emergency Meeting"
            pinColor="purple"
            coordinate={emergencyMeetingLocation}
            title="EmergencyMeeting"
          />
        )}
        {getGameRoom().state.gameState === 'emergency' && player?.isAlive && (
          <View style={styles.emergencyScreen}>
            <CustomText
              textSize={70}
              letterSpacing={3}
              textColor={'#ffffffff'}
              centerText={true}
            >
              Emergency Meeting Called
            </CustomText>
            <CustomText textSize={30} centerText={true} textColor={'white'}>
              Actions are temporarily disabled
            </CustomText>
            <CustomText textSize={30} centerText={true} textColor={'white'}>
              Please Proceed to the Purple Pin
            </CustomText>
          </View>
        )}

        {taskMarkers()}
      </MapView>
      <Minimap
        player={getGameRoom().state.players.find(
          (p) => p.sessionId === getGameRoom().sessionId
        )}
        userCoords={[location.latitude, location.longitude]}
        tasks={tasks}
      />

      {deathScreen()}
      <SabotageFlash sabotageActive={sabotageActive} />

      {/* CONTROL PANEL (BUTTONS) */}
      {playerState == 'crewmate' ? (
        <ControlPanel
          userType={'crewmate'}
          useButtonState={disableActions || buttonState.use}
          useButtonPress={useButton}
          reportButtonState={disableActions || buttonState.report}
          reportButtonPress={reportButton}
          taskCompletion={taskCompletion}
          tasks={tasks}
          manualMovement={manualMovement}
          setManualMovement={setManualMovementHook}
        />
      ) : playerState == 'impostor' ? (
        <ControlPanel
          userType={'impostor'}
          useButtonState={disableActions || buttonState.use}
          useButtonPress={useButton}
          killButtonState={
            disableActions || !player?.isAlive || buttonState.kill
          }
          killButtonPress={killButton}
          cooldown={getGameRoom().state.settings.killCooldown}
          disguiseButtonState={buttonState.disguise}
          sabotageButtonState={disableActions || buttonState.sabotage}
          reportButtonState={disableActions || buttonState.report}
          reportButtonPress={reportButton}
          disguiseButtonPress={disguiseButton}
          taskCompletion={taskCompletion}
          tasks={tasks}
          manualMovement={manualMovement}
          setManualMovement={setManualMovementHook}
          sabotageActive={sabotageActive}
          o2={() => sabotage('o2')}
        />
      ) : playerState == 'disguised' ? (
        <ControlPanel
          userType={'disguisedimpostor'}
          revealButtonPress={revealButton}
          reportButtonState={buttonState.report}
          reportButtonPress={reportButton}
          taskCompletion={taskCompletion}
          tasks={tasks}
          manualMovement={manualMovement}
          setManualMovement={setManualMovementHook}
        />
      ) : (
        <ControlPanel />
      )}

      {/* TESTING BUTTONS */}
      <View style={styles.debugContainer}>
        {/* testing button below */}
        <TouchableOpacity onPress={openVotingModal} style={styles.testButton}>
          <Text>toggle voting modal</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setActiveTask((prevArrState) => ({
              ...prevArrState,
              name: 'electricity',
              taskId: null,
            }));
          }}
          style={styles.testButton}
        >
          <Text>open electricity task</Text>
        </TouchableOpacity>
      </View>

      <VotingModal isModalVisible={votingModalVisible} timer={votingTimer} />

      {/* TASKS */}
      <CaptchaTask
        active={activeTask.name === 'reCaptcha'}
        complete={completeTask}
        closeTask={closeTask}
      />
      <CodeTask
        active={activeTask.name === 'o2'}
        code={Array.from({ length: 4 }, () => Math.floor(Math.random() * 10))}
        complete={completeTask}
        closeTask={closeTask}
      />
      <MemoryTask
        active={activeTask.name === 'memory'}
        code={Array.from({ length: 4 }, () => Math.floor(Math.random() * 16))}
        complete={completeTask}
        closeTask={closeTask}
      />
      <ElectricityTask
        active={activeTask.name === 'electricity'}
        complete={completeTask}
        closeTask={closeTask}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
  },
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  deathScreen: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    backgroundColor: 'red',
    opacity: 0.2,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 300, // To put text slightly above center
  },
  emergencyScreen: {
    position: 'absolute',
    width: '100%',
    bottom: 0,
    backgroundColor: '#ff0000e0',
    padding: 20,
    paddingBottom: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deathText: {},
  debugContainer: {
    alignItems: 'flex-end',
    marginTop: Constants.statusBarHeight,
    borderRadius: 10,
    zIndex: 2,
  },
  testButton: {
    padding: 10,
    margin: 10,
    backgroundColor: 'powderblue',
    borderRadius: 5,
  },
  gameEnded: {
    backgroundColor: 'black',
  },
});

export { GameScreen };
