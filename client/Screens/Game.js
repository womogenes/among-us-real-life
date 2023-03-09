import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Touchable,
  TouchableOpacity,
  Image,
} from 'react-native';
import Constants from 'expo-constants';
import { useState, useEffect } from 'react';
import * as Location from 'expo-location';

import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

import { getLobby } from '../networking.js';

import CustomButton from '../components/button.js';

export default function GameScreen({ navigation }) {
  const [location, setLocation] = useState({
    coords: { latitude: 0, longitude: 0 },
  });
  const [errorMsg, setErrorMsg] = useState(null);
  const [debugMsg, setDebugMsg] = useState('');

  function animate(loc) {
    let r = {
      latitude: loc.coords.latitude,
      longitude: loc.coords.longitude,
    };

    mapView?.animateToRegion(r, 500);
  }

  useEffect(() => {
    // Status update loop
    const room = getLobby();

    room.onStateChange.once((state) => {
      // This is run once, when the client connects
      setDebugMsg(JSON.stringify(state, null, 1));
    });

    room.onStateChange((state) => {
      // This is run whenever the server updates state
      setDebugMsg(JSON.stringify(state, null, 1));
    });
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
          console.log('hello', Date.now());
          setLocation(loc), animate(loc);

          // Send location to server
          getLobby()?.send('location', loc);
        }
      );
    })();

    return async () => {
      // Unmount listener when component unmounts
      console.log('Removed tracking');
      await locationWatcher.remove();
    };
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.debugContainer}>
        {/* Debug container */}
        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Debug</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Menu')}
        >
          <Text style={{ color: '#fff' }}>Back to menu</Text>
        </TouchableOpacity>

        <Text>Session ID: {getLobby().sessionId}</Text>

        <Text style={{ fontFamily: 'Courier New', fontSize: 10 }}>
          {debugMsg}
        </Text>
      </View>

      <MapView
        ref={(ref) => (mapView = ref)}
        style={styles.map}
        pitchEnabled={false}
        rotateEnabled={false}
        scrollEnabled={false}
        zoomEnabled={false}
        initialRegion={{
          latitude: 0,
          longitude: 0,
          latitudeDelta: 0.00038,
          longitudeDelta: 0.000001,
        }}
        mapType="standard"
      >
        {/* Loop through all connected players */}
        <Marker
          coordinate={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          }}
          title="my location"
        />
      </MapView>
      <View>
        <CustomButton
          type={'regular'}
          text={'amogus'}
          image={require('client/assets/usebutton.jpg')}
          roundness={50} backgroundcolor={'white'}
          width={100}
          height={100}
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
    alignItems: 'flex-start',
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
