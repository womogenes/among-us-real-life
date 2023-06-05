import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Button } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { getGameRoom } from '../networking';
import { TaskIcon } from './task-icon';
import { ProfileIcon } from './profile-icon';
import { useEffect, useState } from 'react';

function Minimap(props) {
  const [gameStart, setGameStart] = useState(props.visible);

  useEffect(() => {
    setGameStart(props.visible);
    // console.log(props.visible);
  }, [props.visible]);

  function taskMarkers() {
    return [
      props.tasks.map((item) => {
        return (
          <Marker
            tracksViewChanges={item.complete}
            key={item.taskId}
            coordinate={{
              latitude: item.location.latitude,
              longitude: item.location.longitude,
            }}
            title={item.name}
            zIndex={item.name == 'o2' ? 9 : -1}
          >
            <TaskIcon
              name={item.name}
              complete={item.complete}
              size={20}
            ></TaskIcon>
          </Marker>
        );
      }),
      props.emergencyButton &&
        props.emergencyButton.map((item) => {
          return (
            <Marker
              key={item.taskId}
              coordinate={{
                latitude: item.location.latitude,
                longitude: item.location.longitude,
              }}
              title={item.name}
              zIndex={item.name == 'o2' ? 9 : -1}
            >
              <TaskIcon name={item.name} size={20}></TaskIcon>
            </Marker>
          );
        }),
    ];
  }

  return gameStart ? (
    <></>
  ) : (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        pitchEnabled={false}
        rotateEnabled={false}
        scrollEnabled={false}
        zoomEnabled={false}
        initialRegion={{
          latitude: 47.7326514,
          longitude: -122.3278194,
          latitudeDelta: 0.0025,
          longitudeDelta: 0.0001,
        }}
        // changed from satellite for android for performance
        mapType={Platform.OS === 'ios' ? 'standard' : 'standard'}
        // showsUserLocation={true}
        moveOnMarkerPress={false}
      >
        <Marker
          tracksViewChanges={props.player?.isAlive}
          key={props.player?.sessionId}
          coordinate={{
            latitude: props.player?.location.latitude,
            longitude: props.player?.location.longitude,
          }}
          title={props.player?.username}
        >
          <ProfileIcon player={props.player} size={20} />
        </Marker>
        {taskMarkers()}
      </MapView>
    </View>
  );
}

export default Minimap;

const styles = StyleSheet.create({
  container: {
    width: 200,
    height: 150,
    backgroundColor: 'black',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    left: 100,
    borderRadius: 25,
    position: 'absolute',
    top: 50,
    left: 25,
    zIndex: -1,
  },
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 20,
  },
});
