import { useState } from 'react';
import {
  Image,
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  TextInput,
  KeyboardAvoidingView,
} from 'react-native';
import Constants from 'expo-constants';
import Modal from 'react-native-modal';
import { StatusBar } from 'expo-status-bar';
import { Slider } from '@miblanchard/react-native-slider';

function LobbyScreen({ navigation }) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const handleModal = () => setIsModalVisible(() => !isModalVisible);

  const [killRadius, setKillRadius] = useState(5);
  const [killCooldown, setKillCooldown] = useState(60);

  const handleEditable = () => this.setState({ editable: true });
  const [name, setName] = useState('');

  const startGame = () => {
    navigation.navigate('Game');
  };

  return (
    <KeyboardAvoidingView
      style={styles.lobbyContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      enabled={false}
    >
      <StatusBar style="dark" />
      <View style={styles.settingsContainer}>
        <TouchableOpacity accessibilityRole="button" onPress={handleModal}>
          <Image
            style={styles.settingsIcon}
            source={require('client/assets/settingsIcon.png')}
          />
        </TouchableOpacity>

        <TextInput
          style={styles.nameContainer}
          value={name}
          onChangeText={(name) => setName({ name })}
          placeholder="username"
          onPress={handleEditable}
          adjustsFontSizeToFit={true}
          numberOfLines={1}
        />

        <Text style={styles.codeText}>Code: XXXX</Text>
      </View>

      <View style={styles.playerContainer}></View>

      <View style={styles.bodyContainer}>
        <TouchableOpacity style={styles.button} onPress={startGame}>
          <Text style={styles.buttonText}>Start Game</Text>
        </TouchableOpacity>
      </View>

      <Modal isVisible={isModalVisible}>
        <View style={styles.settingsModal}>
          <View style={styles.settingsModalSettings}>
            <View>
              <Text style={styles.settingsModalText}>
                Kill Radius: {killRadius}
              </Text>
              <Slider
                value={killRadius}
                minimumValue={2}
                maximumValue={10}
                step={1}
                onValueChange={(killRadius) => setKillRadius(killRadius)}
                trackClickable={true}
              />
            </View>
            <View>
              <Text style={styles.settingsModalText}>
                Kill Cooldown: {killCooldown}
              </Text>
              <Slider
                value={killCooldown}
                minimumValue={10}
                maximumValue={240}
                step={10}
                onValueChange={(killCooldown) => setKillCooldown(killCooldown)}
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
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  lobbyContainer: {
    marginTop: Constants.statusBarHeight,
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
    height: 50,
    width: 50,
  },
  nameContainer: {
    backgroundColor: '#BDC9C9',
    fontSize: 20,
    padding: 10,
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 20,
    flex: 1,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  codeText: {
    fontSize: 25,
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
    width: '80%',
    flex: 0.8,
  },
  settingsModalText: {
    fontSize: 20,
    paddingTop: 10,
  },
  settingsModalExit: {
    paddingTop: 20,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 0.2,
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
    justifyContent: 'center',
  },
  buttonText: {
    color: 'black',
    fontSize: 24,
  },
});

export { LobbyScreen };
