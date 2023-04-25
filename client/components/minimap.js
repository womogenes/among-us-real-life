import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Button } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

function Minimap(props) {
  function taskMarkers() {
    return props.tasks.map((item) => {
      if(item.name != 'o2'){
        return (
          <Marker
            pinColor={item.complete ? 'turquoise' : 'gold'}
            key={item.taskId}
            coordinate={{
              latitude: item.location.latitude,
              longitude: item.location.longitude,
            }}
            title={`${item.name} (${item.taskId.substring(0, 4)})`}
          />
        );
      }
      else {
        return (
          <Marker
            pinColor={item.complete ? 'wheat' : 'violet'}
            key={item.taskId}
            coordinate={{
              latitude: item.location.latitude,
              longitude: item.location.longitude,
            }}
            title={`${item.name} (${item.taskId.substring(0, 4)})`}
          />
        );
      }
    });
  }

  return (
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
        mapType={Platform.OS === 'ios' ? 'standard' : 'satellite'}
        // showsUserLocation={true}
      >
        <Marker
          key={'You'}
          coordinate={{
            latitude: props.userCoords[0],
            longitude: props.userCoords[1],
          }}
        />
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
