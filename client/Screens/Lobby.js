import { useEffect, useState } from 'react';
import {
  Image,
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  TextInput,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  FlatList,
} from 'react-native';
import Constants from 'expo-constants';
import Modal from 'react-native-modal';
import { StatusBar } from 'expo-status-bar';
import { Slider } from '@miblanchard/react-native-slider';

import { getGameRoom, leaveGameRoom } from '../networking.js';

function LobbyScreen({ navigation }) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const handleModal = () => setIsModalVisible(() => !isModalVisible);

  const [killRadius, setKillRadius] = useState(5);
  const [killCooldown, setKillCooldown] = useState(60);
  const [prevKillRadius, setPrevKillRadius] = useState(5);
  const [prevKillCooldown, setPrevKillCooldown] = useState(60);

  const [roomState, setRoomState] = useState({});
  const [roomCode, setRoomCode] = useState('XXXX');

  const [memberList, setMemberList] = useState([]);
  const [isHost, setIsHost] = useState(false);

  useEffect(() => {
    // NETWORKING STUFF
    const room = getGameRoom();

    room.onStateChange((state) => {
      setRoomState(state);
      setRoomCode(state.code);
      setMemberList(state.players);
      setIsHost(
        state.players.find((p) => p.sessionId === room.sessionId).isHost
      );
    });

    return () => {
      // Disconnect from the room
      console.log(`Left game room ${room.sessionId}, code: ${room.state.code}`);
      leaveGameRoom();
    };
  }, []);

  function storePrev() {
    setPrevKillRadius(killRadius);
    setPrevKillCooldown(killCooldown);
  }

  function dontSave() {
    setKillRadius(prevKillRadius);
    setKillCooldown(prevKillCooldown);
  }

  function changeNameText(changedName) {
    let newMemberList = [...memberList];
    newMemberList[0] = { key: changedName };
    setMemberList(newMemberList);
  }

  const startGame = () => {
    navigation.navigate('Game');
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
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
              source={require('client/assets/settings.png')}
            />
          </TouchableOpacity>

          <TextInput
            style={styles.nameContainer}
            onChangeText={changeNameText}
            placeholder="Username"
            maxLength={16}
            autoComplete="off"
            autoCorrect={false}
          />

          <Text style={styles.codeText}>Code: {roomCode}</Text>
        </View>

        <View style={styles.playerContainer}>
          <FlatList
            data={memberList}
            renderItem={({ item }) => (
              <TouchableWithoutFeedback>
                <Text style={styles.item}>
                  <Text>{item.sessionId}</Text>
                  <Text>{isHost && ' (Host)'}</Text>
                </Text>
              </TouchableWithoutFeedback>
            )}
          />
        </View>

        <View style={styles.bodyContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={startGame}
            disabled={!isHost}
          >
            <Text style={styles.buttonText}>
              {isHost ? 'Start Game' : 'Waiting on host...'}
            </Text>
          </TouchableOpacity>
        </View>

        <Modal
          isVisible={isModalVisible}
          animationType="slide"
          onShow={storePrev}
        >
          <View style={styles.settingsModal}>
            <View style={styles.settingsModalSettings}>
              <Text style={styles.titleSettings}>Settings</Text>
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
                  Kill Cooldown: {killCooldown}s
                </Text>
                <Slider
                  value={killCooldown}
                  minimumValue={10}
                  maximumValue={240}
                  step={10}
                  onValueChange={(killCooldown) =>
                    setKillCooldown(killCooldown)
                  }
                  trackClickable={true}
                />
              </View>
            </View>
            <View style={styles.settingsModalExit}>
              <TouchableOpacity onPress={handleModal} style={styles.button}>
                <Text style={[styles.buttonText]}>Close and Save</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  handleModal();
                  dontSave();
                }}
                style={styles.closeDontSave}
              >
                <Text style={[styles.dontSaveText]}>Close and Don't Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
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
    marginHorizontal: 10,
    alignItems: 'center',
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
    marginHorizontal: 10,
    borderRadius: 20,
    flex: 1,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
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
    marginTop: 25,
  },
  settingsModalSettings: {
    width: '80%',
    flex: 0.8,
  },
  settingsModalText: {
    fontSize: 20,
    textAlign: 'center',
  },
  settingsModalExit: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    flex: 0.2,
  },
  playerContainer: {
    backgroundColor: '#fff',
    flex: 0.7,
  },
  bodyContainer: {
    flex: 0.2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#BDC9C9',
    borderRadius: 20,
    width: '80%',
    height: '40%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeDontSave: {
    backgroundColor: '#BDC9C9',
    borderRadius: 20,
    width: '80%',
    height: '40%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 20,
  },
  dontSaveText: {
    color: 'red',
    fontSize: 20,
  },
  nameText: {
    fontSize: 30,
  },
  titleSettings: {
    fontSize: 35,
    textAlign: 'center',
    marginTop: 30,
    marginBottom: 40,
  },
  item: {
    color: 'white',
    textAlign: 'center',
    margin: 20,
    padding: 20,
    fontSize: 25,
    borderWidth: 2,
    borderRadius: 15,
  },
});

export { LobbyScreen };
