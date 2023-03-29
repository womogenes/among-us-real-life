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

import { findDistance, distAll } from '../utils.js';

import CaptchaTask from '../components/tasks/recaptcha.js';

var mapView;

export default function GameScreen({ navigation }) {
  const [location, setLocation] = useState({
    coords: { latitude: 0, longitude: 0 },
  });

  const [playerState, setPlayerState] = useState('imposter'); // Change this to change the player type (e.g. crewmate, imposter, disguised)
  const [errorMsg, setErrorMsg] = useState(null);
  const [players, setPlayers] = useState(new Map()); // At some point, we'll want to use a state management lib for this
  const [tasks, setTasks] = useState([
    { name: 'reCaptcha', location: {latitude: 47.73730501931134, longitude: -122.33942051124151}, complete: true }, // Test instance
  ]); // array of the locations of all tasks applicable to the user, will also be marked on the minimap

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

  const [distMap, setDistMap] = useState(new Map());

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
      }
      else{
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
  
  function changeButtonState(button) {
    if (button == 'use') {
      setButtonState((prevButtonState) => ({
        ...prevButtonState,
        use: !buttonState.use,
      }));
    }
    if (button == 'report') {
      setButtonState((prevButtonState) => ({
        ...prevButtonState,
        report: !buttonState.report,
      }));
    }
  }

  function useButton() {
    console.log('USE');
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
    setPlayerState('imposter');
    console.log('REVEAL');
  }

  function findAllDist() {
    setDistMap(distAll(location.coords, players));

    if (distMap.size > 0) {
      console.log('close');
    } else {
      changeButtonState({
        use: buttonState.use,
        report: buttonState.report,
        kill: true,
        disguise: buttonState.disguise,
        sabotage: buttonState.sabotage,
      });
      console.log('far');
    }
  }

  useEffect(() => {
    // Status update loop
    const room = getGameRoom();

    setPlayers(room?.state?.players?.$items);

    room.onStateChange((state) => {
      setPlayers(state.players.$items);
    });

    findAllDist();

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
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);

      locationWatcher = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          distanceInterval: 0.1,
          timeInterval: 100,
        },
        (loc) => {
          setLocation(loc), animate(loc);

          // Send location to server
          getGameRoom()?.send('location', loc);

          findAllDist();
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
        {Array.from(players, ([sessionId, player]) => {
          return (
            <Marker
              key={sessionId}
              coordinate={{
                latitude: player?.location?.latitude,
                longitude: player?.location?.longitude,
              }}
              title={`Player ${sessionId}`}
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
      ) : playerState == 'imposter' ? (
        <ControlPanel
          userType={'imposter'}
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
          userType={'disguisedImposter'}
          revealButtonPress={revealButton}
          reportButtonState={buttonState.report}
          reportButtonPress={reportButton}
          taskCompletion={taskCompletion}
        />
      ) : (
        <ControlPanel />
      )}

      <Button
        title={'increase tasks'}
        onPress={() => setTaskCompletion(taskCompletion + 10)}
      />
      <CaptchaTask />
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

  button: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#888',
    padding: 10,
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
});

export { GameScreen };
