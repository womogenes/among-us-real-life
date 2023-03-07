import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Pressable } from 'react-native';
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

  function animate(loc) {
    let r = {
      latitude: loc.coords.latitude,
      longitude: loc.coords.longitude,
      latitudeDelta: 0.0003,
      longitudeDelta: 0.00001,
    };

    mapView?.animateToRegion(r, 500);
  }

  useEffect(() => {
    // Status update loop
  }, []);

  useEffect(() => {
    // Location update loop
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);

      let userLocation = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          distanceInterval: 0.1,
          timeInterval: 100,
        },
        (loc) => {
          setLocation(loc), animate(loc);

          // Send location to server
          getLobby()?.send('location', loc);
        }
      );
    })();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <MapView
        ref={(ref) => (mapView = ref)}
        style={styles.map}
        pitchEnabled = {false}
        rotateEnabled = {false}
        scrollEnabled = {false}
        zoomEnabled = {false}
        initialRegion={{
          latitude: 0,
          longitude: 0,
          latitudeDelta: 0.00038,
          longitudeDelta: 0.000001,
        }}
        provider={PROVIDER_GOOGLE}
        mapType="satellite"
      >
        <Marker
          coordinate={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          }}
          title="my location"
        />
        <CustomButton text={'amongus'} image={'../assets/menuBackground.png'}/>
      </MapView>
      <View></View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

export { GameScreen };
