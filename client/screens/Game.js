import { StatusBar } from 'expo-status-bar';
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

import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

import { getGameRoom, lobbyRoom } from '../networking.js';
import { findDistance, distAll, findClosest } from '../utils.js';

import Minimap from '../components/minimap.js';
import ControlPanel from '../components/controlpanel.js';

import CaptchaTask from '../components/tasks/recaptcha.js';
import CodeTask from '../components/sabotage/passcode.js';

import CustomText from '../components/text.js';
import VotingModal from '../components/voting.js';

var mapView;
let manualMovementVar; // !! HACK !! React state sucks

export default function GameScreen({ navigation }) {
  const [manualMovement, setManualMovement] = useState(false);
  const setManualMovementHook = (value) => {
    setManualMovement(value); // This is terrible :( why must React be like this
    manualMovementVar = value;
  };
  const setLocationHook = (loc) => {
    if (manualMovementVar) return; // Dev override

    getGameRoom()?.send('location', loc);
    setLocation(loc);
  };

  const [location, setLocation] = useState({
    latitude: 0,
    longitude: 0,
  });

  const [playerState, setPlayerState] = useState('impostor');
  const [playerAlive, setPlayerAlive] = useState(true);

  const [emergencyMeetingLocation, setEmergencyMeetingLocation] =
    useState(null);

  const [refresh, setRefresh] = useState(0); // "Refresh" state to force rerenders
  const [players, setPlayers] = useState([]); // At some point, we'll want to use a state management lib for this
  const [tasks, setTasks] = useState([]); // array of the locations of all tasks applicable to the user, will also be marked on the minimap

  const [sabotageList, setSabotageList] = useState([
    { name: 'Reactor', key: 1, availability: true },
    { name: 'O2', key: 2, availability: true },
    { name: 'Door', key: 3, availability: true },
  ]);
  const [buttonState, setButtonState] = useState({
    use: true, // These should all be true at the beginning of the game
    report: true,
    kill: true,
    disguise: false,
    sabotage: false,
  });

  const [taskCompletion, setTaskCompletion] = useState(0);

  const [activeTask, setActiveTask] = useState({
    reCaptcha: false,
    taskId: undefined,
  });

  const [distTask, setDistTask] = useState([]);
  const [distPlayer, setDistPlayer] = useState([]);

  const [votingModalVisible, setVotingModalVisible] = useState(false);
  const [votingTimer, setVotingTimer] = useState(30);

  const [passcode, setPasscode] = useState(false);

  const openVotingModal = () => {
    getGameRoom()?.send('startVoting');
    setVotingModalVisible(true);
    const timeout = setTimeout(() => {
      setVotingModalVisible(false);
    }, votingTimer * 1000 + 1500); //buffer the timer a bit for transition smoothness

    return () => {
      clearTimeout(timeout);
    };
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

  function taskMarkers() {
    return tasks.map((item) => {
      let markerLabel = `${item.name} ${item.taskId.substring(0, 4)}`;
      if (item.complete) markerLabel += ' (Complete)';

      return (
        <Marker
          pinColor={item.complete ? 'turquoise' : 'gold'}
          key={item.taskId}
          coordinate={{
            latitude: item.location.latitude,
            longitude: item.location.longitude,
          }}
          title={markerLabel}
        />
      );
    });
  }

  function deathScreen() {
    if (!playerAlive) {
      return (
        <View style={styles.deathScreen}>
          <CustomText
            numberOfLines={1}
            textSize={100}
            letterSpacing={3}
            textColor={'white'}
          >
            You Are Dead
          </CustomText>
        </View>
      );
    }
  }

  function completeTask(task) {
    if (task == 'reCaptcha') {
      const { taskId } = activeTask;
      setActiveTask((prevArrState) => ({
        ...prevArrState,
        reCaptcha: false,
        taskId: undefined,
      }));

      // Mark task as complete
      console.log(`reCaptcha task ${taskId} completed`);
      getGameRoom().send('completeTask', taskId);
    }
  }

  function closeTask(task) {
    if (task == 'reCaptcha') {
      setActiveTask((prevArrState) => ({
        ...prevArrState,
        reCaptcha: false,
        taskId: undefined,
      }));
    }
  }

  function changeButtonState(button, state) {
    if (button == 'use') {
      setButtonState((prevButtonState) => ({
        ...prevButtonState,
        use: state,
      }));
    }
    if (button == 'report') {
      setButtonState((prevButtonState) => ({
        ...prevButtonState,
        report: state,
      }));
    }
    if (button == 'kill') {
      setButtonState((prevButtonState) => ({
        ...prevButtonState,
        kill: state,
      }));
    }
  }

  function useButton() {
    console.log('USE');
    let closestTask = findClosest(distTask);

    if (!closestTask.complete) {
      if (closestTask.name == 'reCaptcha') {
        setActiveTask((prevArrState) => ({
          ...prevArrState,
          reCaptcha: true,
          taskId: closestTask.taskId,
        }));
      }
    }
  }

  function reportButton() {
    console.log('REPORT');
  }

  function killButton() {
    console.log('KILL');
    let closestPlayer = findClosest(distPlayer);
    console.log(closestPlayer.sessionId);
    getGameRoom().send('playerDeath', closestPlayer.sessionId);
  }

  function disguiseButton() {
    setPlayerState('disguised');
    console.log('DISGUISE');
  }

  function revealButton() {
    setPlayerState('impostor');
    console.log('REVEAL');
  }

  function findAllDist(loc) {
    let taskDist = distAll('task', loc, tasks, 20);
    let playerArr = getGameRoom().state.players.filter(
      (p) => p.sessionId !== getGameRoom().sessionId
    );
    let playerDist = distAll(
      'player',
      loc.coords,
      playerArr,
      getGameRoom().state.settings.killRadius
    );
    setDistTask(taskDist);
    setDistPlayer(playerDist);
  }

  function activateUseButton() {
    if (distTask.length > 0) {
      changeButtonState('use', false);
    } else {
      changeButtonState('use', true);
    }
  }

  function activateKillButton() {
    if (playerState == 'impostor') {
      if (distPlayer.length > 0) {
        changeButtonState('kill', false);
      } else {
        changeButtonState('kill', true);
      }
    }
  }

  useEffect(() => {
    // Detects when distTask is updated and reevaluates USE button activation
    activateUseButton();
  }, [distTask]);

  useEffect(() => {
    // Detects when distPlayer is updated and reevaluates KILL button activation
    activateKillButton();
  }, [distPlayer]);

  useEffect(() => {
    findAllDist(location);
  }, [location]);

  useEffect(() => {
    findAllDist(location);
  }, [
    JSON.stringify(
      getGameRoom().state.players.filter(
        (p) => p.sessionId !== getGameRoom().sessionId
      )
    ),
  ]);

  useEffect(() => {
    getGameRoom().onMessage('emergencyMeeting', () => {
      setEmergencyMeetingLocation({
        latitude: 47.731317,
        longitude: -122.327169,
      });
    });
  });

  useEffect(() => {
    // Networking update loop
    const room = getGameRoom();

    setPlayers(room?.state?.players);

    const thisPlayer = room.state.players.find(
      (p) => p.sessionId === room.sessionId
    );
    setPlayerState(!thisPlayer.isImpostor ? 'impostor' : 'crewmate');

    room.onStateChange((state) => {
      setPlayers(state.players);
      setPlayerAlive(thisPlayer.isAlive);

      // Animate to new given location and update local state
      const player = state.players.find(
        (player) => player.sessionId === getGameRoom().sessionId
      );
      setLocation({ ...player.location }); // VERY IMPORTANT to make new object here, or useEffect will not fire
      animate(player.location);

      // Get player tasks from room state
      const tasks = state.players.find(
        (p) => p.sessionId === room.sessionId
      ).tasks;
      setTasks(tasks);

      // Set progress bar based on task completion percentage
      // Array.reduce documentation: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce
      const totalTaskCount = state.players.reduce(
        (count, player) => count + player.tasks.length,
        0
      );
      const completedTaskCount = state.players.reduce(
        (count, player) =>
          count +
          player.tasks.reduce((count, task) => count + task.complete, 0),
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
      // await locationWatcher?.remove();
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
        mapType={Platform.OS === 'ios' ? 'standard' : 'satellite'}
      >
        {players.map((player) => {
          return (
            <Marker
              key={player.sessionId}
              coordinate={{
                latitude: player.location.latitude,
                longitude: player.location.longitude,
              }}
              title={`Player ${player.sessionId}`}
            />
          );
        })}
        {emergencyMeetingLocation && (
          <Marker
            key="Emergency Meeting"
            pinColor="purple"
            coordinate={emergencyMeetingLocation}
            title="EmergencyMeeting"
          />
        )}

        {taskMarkers()}
      </MapView>
      <Minimap
        userCoords={[location.latitude, location.longitude]}
        tasks={tasks}
      />

      {deathScreen()}
      {playerState == 'crewmate' ? (
        <ControlPanel
          userType={'crewmate'}
          useButtonState={emergencyMeetingLocation ? true : buttonState.use}
          useButtonPress={useButton}
          reportButtonState={
            emergencyMeetingLocation ? true : buttonState.report
          }
          reportButtonPress={reportButton}
          taskCompletion={taskCompletion}
          tasks={tasks}
          manualMovement={manualMovement}
          setManualMovement={setManualMovementHook}
        />
      ) : playerState == 'impostor' ? (
        <ControlPanel
          userType={'impostor'}
          killButtonState={emergencyMeetingLocation ? true : buttonState.kill}
          killButtonPress={killButton}
          cooldown={10}
          disguiseButtonState={buttonState.disguise}
          sabotageButtonState={
            emergencyMeetingLocation ? true : buttonState.sabotage
          }
          sabotageList={sabotageList}
          reportButtonState={
            emergencyMeetingLocation ? true : buttonState.report
          }
          reportButtonPress={reportButton}
          disguiseButtonPress={disguiseButton}
          taskCompletion={taskCompletion}
          tasks={tasks}
          manualMovement={manualMovement}
          setManualMovement={setManualMovementHook}
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
      {/* testing button below */}
      <TouchableOpacity onPress={openVotingModal} style={styles.testButton}>
        <Text>toggle voting modal</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => setPasscode(true)}
        style={styles.testButton}
      >
        <Text>open passcode task</Text>
      </TouchableOpacity>
      <VotingModal isModalVisible={votingModalVisible} timer={votingTimer} />
      <CaptchaTask
        active={activeTask.reCaptcha}
        complete={completeTask}
        closeTask={closeTask}
      />
      <CodeTask
        active={passcode}
        code={1234}
        complete={completeTask}
        closeTask={closeTask}
      />
      {emergencyMeetingLocation && (
        <View style={styles.emergencyScreen}>
          <CustomText
            textSize={70}
            letterSpacing={3}
            textColor={'red'}
            centerText={true}
          >
            Emergency Meeting Declared
          </CustomText>
          <CustomText textSize={30} centerText={true} textColor={'black'}>
            Actions are now disabled
          </CustomText>
        </View>
      )}
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
  },

  emergencyText: {
    width: '100%',
    height: '100%',
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },

  deathText: {},

  debugContainer: {
    // alignItems: 'flex-start',
    margin: 20,
    marginTop: Constants.statusBarHeight,
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#ffffffdd',
    zIndex: 2,
  },

  testButton: {
    marginTop: Constants.statusBarHeight,
    padding: 5,
    backgroundColor: 'powderblue',
  },
});

export { GameScreen };
