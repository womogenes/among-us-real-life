import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Touchable,
  TouchableOpacity,
  Button,
  Image,
  ScrollView,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

function Minimap(props) {
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
            latitudeDelta: 0.002,
            longitudeDelta: 0.0001,
            }}
            mapType="standard">
            </MapView>
        </View>
    );
}

export default Minimap

const styles = StyleSheet.create({
    container: {
        width: 200,
        height: 150,
        backgroundColor: 'black',
        alignItems: 'stretch',
        justifyContent: 'flex-start',
        left: 100, 
    },
    map: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
})