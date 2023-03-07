import { useState } from 'react';
import {
  Image,
  TouchableOpacity,
  Pressable,
  StyleSheet,
  Button,
  Text,
  View,
} from 'react-native';
import Constants from 'expo-constants';
import Modal from 'react-native-modal';
import { withSafeAreaInsets } from 'react-native-safe-area-context';
import { Slider } from '@miblanchard/react-native-slider';

function LobbyScreen({ navigation }) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const handleModal = () => setIsModalVisible(() => !isModalVisible);

  const [setting1, setSetting1] = useState(5);

  const startGame = () => {
    navigation.navigate('Game');
  };

  return (
    <View style={styles.lobbyContainer}>
      <View style={styles.settingsContainer}>
        <TouchableOpacity accessibilityRole="button" onPress={handleModal}>
          <Image
            style={styles.settingsIcon}
            source={require('client/assets/settingsIcon.png')}
          />
        </TouchableOpacity>
        <Text style={styles.codeText}>Code: XXXXXX</Text>
      </View>

      <View style={styles.playerContainer}></View>

      <View style={styles.bodyContainer}>
        <TouchableOpacity style={styles.button} onPress={startGame}>
          <Text style={[styles.buttonText, { fontSize: 24 }]}>Start Game</Text>
        </TouchableOpacity>
      </View>

      <Modal isVisible={isModalVisible}>
        <View style={styles.settingsModal}>
          <View style={styles.settingsModalSettings}>
            <View>
              <Text style={styles.settingsModalText}>Setting1: {setting1}</Text>
              <Slider
                value={setting1}
                minimumValue={2}
                maximumValue={10}
                step={1}
                onValueChange={(setting1) => setSetting1(setting1)}
                trackClickable={true}
              />
            </View>
          </View>
          <View style={styles.settingsModalExit}>
            <TouchableOpacity onPress={handleModal} style={styles.button}>
              <Text style={[styles.buttonText, { fontSize: 24 }]}>
                Close Settings
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  lobbyContainer: {
    paddingTop: Platform.OS === 'ios' ? 0 : Constants.statusBarHeight,
    flex: 1,
    backgroundColor: '#ffffff',
    flexDirection: 'column',
  },
  settingsContainer: {
    marginLeft: 5,
    marginRight: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 0.1,
  },
  settingsIcon: {
    justifyContent: 'flex-start',
    height: 50,
    width: 50,
  },
  settingsModal: {
    backgroundColor: 'white',
    borderRadius: 20,
    flex: 1,
    color: 'white',
    alignItems: 'center',
  },
  settingsModalSettings: {
    padding: 5,
    margin: 10,
    backgroundColor: 'red',
    width: '80%',
    flex: 0.8,
  },
  settingsModalText: {
    fontSize: 20,
    paddingTop: 10,
  },
  settingsModalExit: {
    padding: 5,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 0.2,
  },
  codeText: {
    fontSize: 25,
  },
  playerContainer: {
    backgroundColor: 'red',
    flex: 0.7,
  },
  bodyContainer: {
    padding: 15,
    flex: 0.2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#BDC9C9',
    padding: 10,
    borderRadius: 20,
    width: '80%',
    height: '40%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'black',
  },
});

export { LobbyScreen };
