import {
  StyleSheet,
  View,
  TouchableOpacity,
  Button,
  Text,
  Platform,
  ActivityIndicator,
  Modal,
  SafeAreaView,
  Image,
} from 'react-native';
import Constants from 'expo-constants';
import { useState, useEffect, useRef } from 'react';
import * as Location from 'expo-location';
import * as Haptics from 'expo-haptics';

import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

import { getGameRoom, lobbyRoom, leaveGameRoom } from '../networking.js';
import { findDistance, distAll, findClosest, findDirection } from '../utils.js';
// import * as taskUtils from '../tasks-utils.js';
const taskUtils = require('../tasks-utils.js');

import Minimap from '../components/minimap.js';
import ControlPanel from '../components/controlpanel.js';
import Timer from '../components/timer.js';
import CustomText from '../components/text.js';
import SabotageFlash from '../components/flash.js';
import EmergencyScreen from '../components/emergencyscreen.js';
import VotingModal from '../components/voting.js';

// TASKS
import CaptchaTask from '../components/tasks/recaptcha.js';
import MemoryTask from '../components/tasks/memory.js';
import ElectricityTask from '../components/tasks/electricity.js';
import CalibrateTask from '../components/tasks/calibrate.js';

// SABOTAGE TASKS
import CodeTask from '../components/sabotage/passcode.js';
import ScanTask from '../components/sabotage/scanner.js';

// OTHER TASKS
import EmergencyButton from '../components/tasks/emergencybutton.js';

// ICONS
import { ProfileIcon } from '../components/profile-icon.js';
import { TaskIcon } from '../components/task-icon.js';

// POPUP MODALS
import { EjectModal } from '../components/animation-modals/eject-modal.js';
import { DeathModal } from '../components/animation-modals/death-modal.js';
import { MeetingModal } from '../components/animation-modals/meeting-modal.js';
import { EndGame } from '../components/animation-modals/end-game.js';
import { StartGame } from '../components/animation-modals/start-game.js';

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

  // SABOTAGE, EMERGENCY MEETING AND VOTING HOOKS
  const [sabotageActive, setSabotageActive] = useState(false);
  const [sabotageType, setSabotageType] = useState();
  const [sabotageTasks, setSabotageTasks] = useState([]);
  const [sabNotif, setSabNotif] = useState(false);
  const [sabotageOnCooldown, setSabotageOnCooldown] = useState(false);
  const [emergencyMeetingLocation, setEmergencyMeetingLocation] = useState({
    latitude: 0,
    longitude: 0,
  });
  const [votingModalVisible, setVotingModalVisible] = useState(false);
  const [votingTimer, setVotingTimer] = useState(-1); // Now dynamically changes!
  const [ejectedPlayer, setEjectedPlayer] = useState({});
  const [winningTeam, setWinningTeam] = useState();

  // BUTTON HOOKS
  const [disableActions, setDisableActions] = useState(false);
  const [buttonState, setButtonState] = useState({
    use: true, // These should all be true at the beginning of the game
    report: true,
    kill: true,
    disguise: false,
    sabotage: false,
  });

  // ENDING GAME HOOKS

  // TASK HOOKS
  const [taskCompletion, setTaskCompletion] = useState(0);
  const [activeTask, setActiveTask] = useState({
    name: null,
    taskId: null,
  });
  const [distTask, setDistTask] = useState([]); // array of all tasks with distance/direction within a certain radius
  const [distAllTask, setDistAllTask] = useState([]); // array of all tasks with distance/direction from anywhere (aka very large radius)
  const [tasks, setTasks] = useState([]); // array of the locations of all tasks applicable to the user, will also be marked on the minimap
  const [closestTask, setClosestTask] = useState();

  // PLAYER HOOKS
  const [location, setLocation] = useState({
    latitude: 0,
    longitude: 0,
  });
  const [playerState, setPlayerState] = useState('impostor');
  const [players, setPlayers] = useState([]); // list of all players
  const [player, setPlayer] = useState(); // Player state, continually updated by server (for convenience)
  const [currPlayer, setCurrPlayer] = useState(); // more stable version of Player
  const [distPlayer, setDistPlayer] = useState([]);
  const [arrowActive, setArrowActive] = useState(false);
  const [taskNum, setTaskNum] = useState(0); // Used for impostor random complete tasks
  const [killOnCooldown, setKillOnCooldown] = useState(false);
  const [emergencyButton, setEmergencyButton] = useState([]); // array of the locations of the emergency button, will also be marked on the minimap
  const [impostorEmergency, setImpostorEmergency] = useState(false);

  const [playerKiller, setPlayerKiller] = useState(); // player who killed you
  const [playerReporter, setPlayerReporter] = useState(); // player who reported
  const [playerDead, setPlayerDead] = useState(); // player whose body was reported

  // POPUP VISIBILITY
  const [startModalVisible, setStartModalVisible] = useState(true);
  const [deathModalVisible, setDeathModalVisible] = useState(false);
  const [meetingModalVisible, setMeetingModalVisible] = useState(false);

  //REFRESH + LOADING HOOK
  const [refresh, setRefresh] = useState(0); // "Refresh" state to force rerenders
  const [loading, setLoading] = useState(true); // "Refresh" state to force rerenders

  //// FUNCTIONS
  function randomComplete(minDelay, maxDelay) {
    if (currPlayer?.isImpostor) {
      // Completes closest fake task after a random interval of time, works in conjunction with a useEffect
      let delay = Math.random() * (maxDelay - minDelay + 1) + minDelay; // generates a number between minDelay and maxDelay in miliseconds
      setTimeout(() => {
        if (
          closestTask != undefined &&
          closestTask.name !== 'o2' &&
          closestTask.name !== 'reactor' &&
          closestTask.name !== 'emergency' &&
          !sabotageActive &&
          getGameRoom().state.gameState !== 'voting'
        ) {
          taskUtils.autoCompleteTask(closestTask, getGameRoom);
        }
        setTaskNum(taskNum + 1);
      }, delay * 1000);
    } else {
      setTimeout(() => {
        setTaskNum(taskNum + 1);
      }, 1000);
    }
  }

  // SABOTAGE, EMERGENCY MEETING AND VOTING FUNCTIONS
  function sabotage(type) {
    getGameRoom().send(type);
    setSabotageActive(true);
    setSabotageType(type);
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

  function endSabotageCooldown() {
    setSabotageOnCooldown(false);
  }

  function endKillCooldown() {
    setKillOnCooldown(false);
  }

  // BUTTON FUNCTIONS
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
          (closestTask.name === 'o2' || closestTask.name === 'reactor')) ||
        (playerState == 'impostor' && closestTask.name === 'emergency'))
    ) {
      if (currPlayer?.isAlive) {
        setActiveTask((prevArrState) => ({
          ...prevArrState,
          name: closestTask.name,
          taskId: closestTask.taskId,
        }));
      } else if (!currPlayer?.isAlive && !closestTask.name === 'emergency') {
        // Dead players cannot call an emergency meeting
        setActiveTask((prevArrState) => ({
          ...prevArrState,
          name: closestTask.name,
          taskId: closestTask.taskId,
        }));
      }
    }
  }
  function reportButton() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    let deadPlayer = findClosest(distPlayer.filter((p) => !p.isAlive));
    getGameRoom().send('callEmergency', {
      location: location,
      type: 'report',
      body: deadPlayer,
    });
  }
  function killButton() {
    let closestPlayer = findClosest(distPlayer);
    if (!closestPlayer.isImpostor) {
      getGameRoom().send('playerDeath', closestPlayer.sessionId);
    }
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
        if (!currPlayer?.isAlive) {
          // Dead players cannot use sabotage tasks or call emergency meetings
          if (
            findClosest(distTask).name !== 'o2' &&
            findClosest(distTask).name !== 'reactor' &&
            findClosest(distTask).name !== 'emergency'
          ) {
            changeButtonState('use', false);
          }
        } else {
          changeButtonState('use', false);
        }
        if (buttonState.use === true) {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        }
      } else if (
        playerState == 'impostor' &&
        (findClosest(distTask).name === 'o2' ||
          findClosest(distTask).name === 'reactor')
      ) {
        changeButtonState('use', false);
      } else if (
        playerState == 'impostor' &&
        findClosest(distTask).name === 'emergency'
      ) {
        // Impostor use button appears when near emergency meeting button
        setImpostorEmergency(true);
        changeButtonState('use', false);
      }
    } else {
      setImpostorEmergency(false);
      changeButtonState('use', true);
    }
  }
  function activateKillButton() {
    if (playerState == 'impostor' && currPlayer?.isAlive) {
      changeButtonState(
        'kill',
        !(distPlayer.filter((p) => p.isAlive && !p.isImpostor).length > 0)
      );
    }
  }
  function activateReportButton() {
    if (currPlayer?.isAlive) {
      let c = !(distPlayer.filter((p) => !p.isAlive).length > 0);
      if (!c)
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      changeButtonState('report', c);
    }
  }

  // TASK FUNCTIONS
  const taskMarkers = () => taskUtils.taskMarkers(tasks, emergencyButton);
  const completeTask = () =>
    taskUtils.completeTask(
      activeTask,
      setActiveTask,
      getGameRoom,
      sabotageActive
    );
  const closeTask = () => taskUtils.closeTask(setActiveTask);

  // PLAYER AND TASK LOCATION
  const setLocationHook = (loc) => {
    //for testing only
    if (manualMovementVar) return;
    //
    getGameRoom()?.send('location', loc);
    setLocation(loc);
    setLoading(false);
    setArrowActive(true);
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
    let taskAllDist;
    let emergencyButtonDist;
    if (emergencyButton) {
      emergencyButtonDist = distAll('task', loc, emergencyButton, 20);
    }
    if (sabotageActive == true) {
      taskAllDist = distAll('task', loc, sabotageTasks, 1000000);
    } else {
      taskAllDist = distAll('task', loc, tasks, 1000000);
    }
    let playerArr = players.filter(
      (p) => p.sessionId !== getGameRoom().sessionId
    );
    let playerDist = distAll(
      'player',
      loc,
      playerArr,
      getGameRoom().state.settings.killRadius
    );
    if (
      emergencyButtonDist &&
      emergencyButtonDist.length > 0 &&
      !sabotageActive
    ) {
      // Emergency meetings can't be called during a sabotage
      setDistTask(taskDist.concat(emergencyButtonDist));
    } else {
      setDistTask(taskDist);
    }
    setDistAllTask(taskAllDist);
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
      let newLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
        maximumAge: 10000,
      });
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
    // Part of impostor random task completion loop
    randomComplete(45, 120); // auto completes closest task with random time interval between 45 and 120 seconds
  }, [taskNum]);

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
    // detects closest task in any range
    setClosestTask(findClosest(distAllTask));
  }, [distAllTask]);
  useEffect(() => {
    findAllDist(location);
    if (sabotageActive) {
      // Replaces the task array with only sabotage tasks for the arrow pointer
      let arr = [];
      tasks.forEach((task) => {
        if (task.name === 'o2' || task.name === 'reactor') {
          arr.push(task);
        }
      });
      setSabotageTasks(arr);
    } else {
      setSabotageTasks([]);
    }
  }, [location]);
  useEffect(() => {
    findAllDist(location);
  }, [
    JSON.stringify(
      players.filter((p) => p.sessionId !== getGameRoom().sessionId)
    ),
  ]);

  // SABOTAGE
  useEffect(() => {
    if (activeTask.taskId === sabNotif) {
      closeTask();
    }
  }, [sabNotif]);

  // SERVER STUFF
  useEffect(() => {
    // Networking update loop
    const room = getGameRoom();

    setPlayers(room?.state?.players);

    const thisPlayer = room.state.players.find(
      (p) => p.sessionId === room.sessionId
    );
    setPlayerState(thisPlayer.isImpostor ? 'impostor' : 'crewmate');
    if (playerState === 'impostor') {
      setTaskNum(1); // Starts impostor autocomplete chain
      setSabotageOnCooldown(true);
      setKillOnCooldown(true);
    }

    room.onMessage('startVoting', () => {
      setArrowActive(false);
      setMeetingModalVisible(false);
      setDeathModalVisible(false);
      openVotingModal();
    });

    room.onMessage('playerEjected', (playerId) => {
      console.log(`Player ${playerId} was voted out`);
      if (!playerId) return;

      // ! HACK ! prevent conflicting display with the voting modal
      setTimeout(() => {
        setEjectedPlayer(
          getGameRoom().state.players.find((p) => p.sessionId === playerId)
        );
        setArrowActive(false);
      }, 1000);

      setSabotageOnCooldown(true);
      setKillOnCooldown(true);
    });

    room.onMessage('sabotage', () => {
      setSabotageActive(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    });

    room.onMessage('sabotageOver', () => {
      setSabotageActive(false);
      setSabotageOnCooldown(true);
    });

    room.onMessage('task complete', (taskId) => {
      setSabNotif(taskId);
    });

    room.onMessage('emergency called', (message) => {
      setPlayerReporter(message.caller);
      setPlayerDead(message.body);
      closeTask();
      setDeathModalVisible(false);
      setStartModalVisible(false);
      setMeetingModalVisible(true);
    });

    room.onMessage('you died', (message) => {
      if (getGameRoom()?.sessionId === message.sessionId) {
        closeTask();
        setStartModalVisible(false);
        setPlayerKiller(
          getGameRoom().state.players.find(
            (p) => p.sessionId === message.client.sessionId
          )
        );
        setTimeout(() => {
          // Makes sure modal appears after everything else is closed
          setDeathModalVisible(true);
        }, 1000);
      }
    });

    room.onMessage('endedGame', (message) => {
      console.log(`endedgame`);
      setArrowActive(false);
      if (message == 'impostor') {
        setWinningTeam('impostor');
      } else if (message == 'crewmate') {
        setWinningTeam('crewmate');
      }
    });

    room.onStateChange((state) => {
      setPlayers(state.players);
      setPlayer();

      const player = state.players?.find(
        (player) => player.sessionId === getGameRoom().sessionId
      );
      setPlayer(player);
      setCurrPlayer(player);
      setTasks(player.tasks);
      setEmergencyButton(player.emergency);

      // Update sabotage activity
      setSabotageActive(state.gameState === 'sabotage');

      // Animate to new given location and update local state
      setLocation({ ...player.trueLocation }); // VERY IMPORTANT to make new object here, or useEffect will not fire
      animate(player.trueLocation);

      // Set emergency meeting location, if applicable
      setEmergencyMeetingLocation({ ...state.emergencyMeetingLocation });
      setDisableActions(room.state.gameState === 'emergency');

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

  return loading ? (
    <View style={styles.loading}>
      <ActivityIndicator size="large" />
    </View>
  ) : (
    <View style={styles.container}>
      {/* !! HACKY STUFF!! Force rerenders with this state */}
      <View style={{ display: 'none' }}>
        <CustomText>
          {refresh}
          {manualMovement}
          {location.longitude}
        </CustomText>
      </View>

      <View style={styles.debugContainer}>
        <TouchableOpacity
          onPress={() => {
            leaveGameRoom();
            navigation.navigate('Menu');
          }}
          style={styles.testButton}
        >
          <Text>Leave game</Text>
        </TouchableOpacity>
      </View>

      {/* MAIN MAP */}
      <MapView
        ref={(ref) => (mapView = ref)}
        style={styles.map}
        pitchEnabled={false}
        rotateEnabled={false}
        scrollEnabled={false}
        initialRegion={{
          latitude: 47.7326514,
          longitude: -122.3278194,
          latitudeDelta: 0.002,
          longitudeDelta: 0.002,
        }}
        // Changed from satellite for android for performance
        mapType={Platform.OS === 'ios' ? 'standard' : 'standard'}
        moveOnMarkerPress={false}
        liteMode={true}
      >
        {/* PLAYER MARKERS */}
        {players.map((p) => {
          let displayLoc =
            p?.isAlive || p.sessionId === getGameRoom().sessionId
              ? p.trueLocation
              : p.location;

          if (
            findDistance(location, displayLoc) >
            getGameRoom().state.settings.playerSight
          ) {
            return;
          }

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
                direction={closestTask.direction}
                active={arrowActive}
                sabotage={sabotageActive}
                isImpostor={currPlayer?.isImpostor}
                myId={currPlayer?.sessionId}
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

        {taskMarkers()}
      </MapView>

      <Minimap
        player={currPlayer}
        userCoords={[location.latitude, location.longitude]}
        tasks={tasks}
        emergencyButton={emergencyButton}
      />

      {deathScreen()}
      <SabotageFlash
        sabotageActive={sabotageActive}
        sabotageType={sabotageType}
      />
      <EmergencyScreen
        emergencyActive={getGameRoom().state.gameState === 'emergency'}
        playerAlive={player?.isAlive}
        playerLocation={location}
        meetingLocation={emergencyMeetingLocation}
      />

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
          killCooldown={getGameRoom().state.settings.killCooldown}
          killOnCooldown={killOnCooldown}
          endKillCooldown={() => endKillCooldown()}
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
          sabotageOnCooldown={sabotageOnCooldown}
          sabotageCooldown={getGameRoom().state.settings.saboCooldown}
          endSabotageCooldown={() => endSabotageCooldown()}
          o2={() => sabotage('o2')}
          reactor={() => sabotage('reactor')}
          emergencyButton={impostorEmergency}
          emergencyActive={getGameRoom().state.gameState === 'emergency'}
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

      <VotingModal
        isVisible={votingModalVisible}
        timer={votingTimer}
        myId={currPlayer?.sessionId}
        isImpostor={currPlayer?.isImpostor}
        reporter={playerReporter}
      />
      <EjectModal
        onClose={() => [setEjectedPlayer({}), setArrowActive(true)]}
        player={ejectedPlayer}
      />
      <DeathModal
        isVisible={deathModalVisible}
        killer={playerKiller}
        player={currPlayer}
        onClose={() => setDeathModalVisible(false)}
      />
      <MeetingModal
        isVisible={meetingModalVisible}
        reporter={playerReporter}
        dead={playerDead}
        onClose={() => setMeetingModalVisible(false)}
      />
      <StartGame
        isVisible={startModalVisible}
        players={getGameRoom().state.players}
        isImpostor={currPlayer?.isImpostor}
        sessionId={currPlayer?.sessionId}
        onClose={() => setStartModalVisible(false)}
      />
      <EndGame
        size={100}
        team={winningTeam}
        players={players}
        myId={currPlayer?.sessionId}
        onClose={() => {
          leaveGameRoom();
          navigation.navigate('Menu');
        }}
      />

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
      <ScanTask
        active={activeTask.name === 'reactor'}
        complete={completeTask}
        closeTask={closeTask}
      />
      <MemoryTask
        active={activeTask.name === 'memory'}
        code={Array.from({ length: 4 }, () => Math.floor(Math.random() * 16))}
        complete={completeTask}
        closeTask={() => {
          closeTask();
          console.log('hello');
        }}
      />
      <ElectricityTask
        active={activeTask.name === 'electricity'}
        code={Array.from({ length: 3 }, () => Math.floor(Math.random() * 9))}
        complete={completeTask}
        closeTask={closeTask}
      />
      <CalibrateTask
        active={activeTask.name === 'calibrate'}
        complete={completeTask}
        closeTask={closeTask}
      />
      <EmergencyButton
        active={activeTask.name === 'emergency'}
        callEmergency={() =>
          getGameRoom().send('callEmergency', {
            location: location,
            type: 'button',
            body: undefined,
          })
        }
        emergency={emergencyButton}
        closeTask={closeTask}
      />
      <Timer
        playing={sabotageActive}
        completion={() => getGameRoom().send('sabotageDeath')}
      />
      <Image source={require('../assets/dimmer.png')} style={styles.dimmer} />
    </View>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dimmer: {
    position: 'absolute',
    alignSelf: 'center',
    verticalAlign: 'center',
    opacity: 0.5,
    transform: [{ scale: 2.0 }],
    zIndex: -1,
  },
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
    zIndex: -2,
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
  deathText: {},
  debugContainer: {
    position: 'absolute',
    right: 20,
    top: Constants.statusBarHeight,
    alignItems: 'flex-end',
    borderRadius: 10,
    zIndex: 2,
  },
  testButton: {
    padding: 10,
    margin: 10,
    backgroundColor: '#ddd',
    borderRadius: 5,
  },
  gameEnded: {
    backgroundColor: 'black',
    flex: 1,
  },
});

export { GameScreen };
