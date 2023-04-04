import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Button,
  Platform,
} from 'react-native';
import Constants from 'expo-constants';
import { useState, useEffect, useRef } from 'react';
import * as Location from 'expo-location';

import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

import { getGameRoom, lobbyRoom } from '../networking.js';

import Minimap from '../components/minimap.js';

import ControlPanel from '../components/controlpanel.js';

import { findDistance, distAll, findClosestTask } from '../utils.js';

import CaptchaTask from '../components/tasks/recaptcha.js';

var mapView;

export default function GameScreen({ navigation }) {
  const [location, setLocation] = useState({
    coords: { latitude: 0, longitude: 0 },
  });

  const [playerState, setPlayerState] = useState('impostor'); // Change this to change the player type (e.g. crewmate, impostor, disguised)
  const [errorMsg, setErrorMsg] = useState(null);
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

  const [taskCompletion, setTaskCompletion] = useState(10);

  const [activeTask, setActiveTask] = useState({
    reCaptcha: false,
  });

  const [distTask, setDistTask] = useState([]);
  const [distPlayer, setDistPlayer] = useState([]);

  const animate = (loc) => {
    let r = {
      latitude: loc.coords.latitude,
      longitude: loc.coords.longitude,
    };

    mapView?.animateToRegion(r, 500);
  };

  function taskMarkers() {
    return tasks.map((item) => {
      if (item.complete == false) {
        return (
          <Marker
            pinColor={'gold'}
            key={Math.random()}
            coordinate={{
              latitude: item.location.latitude,
              longitude: item.location.longitude,
            }}
            title={item.name}
          />
        );
      } else {
        return (
          <Marker
            pinColor={'turquoise'}
            key={Math.random()}
            coordinate={{
              latitude: item.location.latitude,
              longitude: item.location.longitude,
            }}
            title={item.name}
          />
        );
      }
    });
  }

  function completeTask(task) {
    if (task == 'reCaptcha') {
      console.log('reCaptcha deactivate');
      setActiveTask((prevArrState) => ({
        ...prevArrState,
        reCaptcha: false,
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
    let closestTask = findClosestTask(distTask);
    if (closestTask.name == 'reCaptcha') {
      setActiveTask((prevArrState) => ({
        ...prevArrState,
        reCaptcha: true,
      }));
    }
  }

  function reportButton() {
    console.log('REPORT');
  }

  function killButton() {
    console.log('KILL');
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
    let taskArr = distAll(loc.coords, tasks, 10);
    let playerArr = distAll(loc.coords, players, 0.1);
    setDistTask(taskArr);
    setDistPlayer(playerArr);
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
      console.log(distPlayer);
      if (distPlayer.length > 0) {
        console.log('<<<close>>>');
        changeButtonState('kill', false);
      } else {
        console.log('<<<far>>>');
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
  }, [players]);

  useEffect(() => {
    // Status update loop
    const room = getGameRoom();

    setPlayers(room?.state?.players);

    room.onStateChange((state) => {
      setPlayers(state.players);

      // Get player tasks from room state
      const tasks = state.players.find(
        (p) => p.sessionId === room.sessionId
      ).tasks;
      setTasks(tasks);
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

      let newLocation = await Location.getCurrentPositionAsync({});
      setLocation(newLocation);

      locationWatcher = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          distanceInterval: 0.1,
          timeInterval: 10,
        },
        (loc) => {
          setLocation(loc), animate(loc);

          // Send location to server
          getGameRoom()?.send('location', loc);
        }
      );
    })();

    return async () => {
      // Unmount listener when component unmounts
      await locationWatcher?.remove();
    };
  }, []);

  return (
    <View style={styles.container}>
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
          latitudeDelta: 0.001,
          longitudeDelta: 0.001,
        }}
        mapType={Platform.OS === 'ios' ? 'standard' : 'satellite'}
      >
        {players.map((player) => {
          return (
            <Marker
              key={player.sessionId}
              coordinate={{
                latitude: player?.location?.latitude,
                longitude: player?.location?.longitude,
              }}
              title={`Player ${player.sessionId}`}
            />
          );
        })}
        {taskMarkers()}
      </MapView>
      <Minimap
        userCoords={[location.coords.latitude, location.coords.longitude]}
        taskCoords={tasks.location}
      />
      {playerState == 'crewmate' ? (
        <ControlPanel
          userType={'crewmate'}
          useButtonState={buttonState.use}
          useButtonPress={useButton}
          reportButtonState={buttonState.report}
          reportButtonPress={reportButton}
          taskCompletion={taskCompletion}
        />
      ) : playerState == 'impostor' ? (
        <ControlPanel
          userType={'impostor'}
          killButtonState={buttonState.kill}
          killButtonPress={killButton}
          cooldown={10}
          disguiseButtonState={buttonState.disguise}
          sabotageButtonState={buttonState.sabotage}
          sabotageList={sabotageList}
          reportButtonState={buttonState.report}
          reportButtonPress={reportButton}
          disguiseButtonPress={disguiseButton}
          taskCompletion={taskCompletion}
        />
      ) : playerState == 'disguised' ? (
        <ControlPanel
          userType={'disguisedimpostor'}
          revealButtonPress={revealButton}
          reportButtonState={buttonState.report}
          reportButtonPress={reportButton}
          taskCompletion={taskCompletion}
        />
      ) : (
        <ControlPanel />
      )}

      <CaptchaTask active={activeTask.reCaptcha} complete={completeTask} />
      <View style={styles.increaseTaskContainer}>
        <Button
          title={'increase tasks'}
          onPress={() => setTaskCompletion(taskCompletion + 10)}
        />
      </View>
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

  debugContainer: {
    // alignItems: 'flex-start',
    margin: 20,
    marginTop: Constants.statusBarHeight,
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#ffffffdd',
    zIndex: 2,
  },

  increaseTaskContainer: {
    marginTop: Constants.statusBarHeight,
  },
});

export { GameScreen };
