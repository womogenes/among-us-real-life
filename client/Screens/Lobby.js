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
import { SafeAreaView } from 'react-native-safe-area-context';

function LobbyScreen({ navigation }) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const handleModal = () => setIsModalVisible(() => !isModalVisible);

  const [killRadius, setKillRadius] = useState(5);
  const [killCooldown, setKillCooldown] = useState(60);
  const [prevKillRadius, setPrevKillRadius] = useState(5);
  const [prevKillCooldown, setPrevKillCooldown] = useState(60);

  const [roomState, setRoomState] = useState({});
  const [roomCode, setRoomCode] = useState('0000');

  const [memberList, setMemberList] = useState([]);
  const [isHost, setIsHost] = useState(false);

  useEffect(() => {
    // NETWORKING STUFF
    const room = getGameRoom();

    room.onStateChange((state) => {
      setRoomState(state);
      setRoomCode(state.code);
      setMemberList([...state.players]);
      setIsHost(
        state.players.find((p) => p.sessionId === room.sessionId).isHost
      );
    });

    room.onMessage('gameStarted', () => {
      navigation.navigate('Game');
    });

    room.onMessage('gameEnded', () => {
      navigation.navigate('Menu');
    });

    return () => {
      // Disconnect from the room
      console.log(`Left game room ${room.sessionId}, code: ${room.state.code}`);
      // leaveGameRoom();
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
    const idx = memberList.findIndex(
      (m) => m.sessionId === getGameRoom().sessionId
    );
    newMemberList[idx].username = changedName;
    setMemberList(newMemberList);

    getGameRoom().send('setUsername', changedName);
  }

  const startGame = () => {
    if (isHost) getGameRoom().send('startGame');
  };

  function endGame() {
    getGameRoom().send('endGame');
  }
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
                  <Text>{item.username || 'Anonymous'}</Text>
                  <Text>{item.isHost && ' (Host)'}</Text>
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
                <Text style={styles.buttonText}>Close and Save</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  handleModal();
                  dontSave();
                }}
                style={styles.button}
              >
                <Text style={styles.redText}>Close and Don't Save</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={endGame}
                style={styles.button}
                disabled={!isHost}
              >
                <Text style={styles.redText}>Close Room</Text>
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
    paddingTop: Constants.statusBarHeight,
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
    marginHorizontal: 10,
    borderRadius: 20,
    flex: 1,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    fontSize: 45,
    fontFamily: 'Impostograph-Regular',
  },
  codeText: {
    fontSize: 50,
    fontFamily: 'Impostograph-Regular',
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
    width: '85%',
    flex: 0.75,
  },
  settingsModalText: {
    textAlign: 'center',
    fontSize: 40,
    fontFamily: 'Impostograph-Regular',
  },
  settingsModalExit: {
    width: '110%', // Cheeky override for the fact that button width is 80%
    alignItems: 'center',
    justifyContent: 'space-evenly',
    flex: 0.2,
    marginBottom: 12,
  },
  playerContainer: {
    backgroundColor: '#FFFFFF',
    color: '#000',
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
    margin: 60,
  },
  buttonText: {
    fontSize: 50,
    fontFamily: 'Impostograph-Regular',
  },
  redText: {
    color: 'red',
    fontSize: 50,
    fontFamily: 'Impostograph-Regular',
  },
  nameText: {
    fontSize: 60,
    fontFamily: 'Impostograph-Regular',
  },
  titleSettings: {
    fontSize: 70,
    textAlign: 'center',
    marginTop: 30,
    marginBottom: 40,
    fontFamily: 'Impostograph-Regular',
  },
  item: {
    color: '#000000',
    textAlign: 'center',
    marginHorizontal: 20,
    marginVertical: 10,
    padding: 10,
    fontSize: 50,
    borderWidth: 2,
    borderRadius: 15,
    fontFamily: 'Impostograph-Regular',
  },
});

export { LobbyScreen };
