import { useEffect, useState } from 'react';
import {
  Image,
  TouchableOpacity,
  StyleSheet,
  View,
  TextInput,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  FlatList,
} from 'react-native';
import Constants from 'expo-constants';
import Modal from 'react-native-modal';
import { Slider } from '@miblanchard/react-native-slider';
import * as Haptics from 'expo-haptics';

import CustomText from '../components/text.js';
import { ProfileIcon } from '../components/profile-icon.js';

import { getGameRoom, leaveGameRoom } from '../networking.js';

function LobbyScreen({ navigation }) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const handleModal = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsModalVisible(() => !isModalVisible);
  };

  const [killRadius, setKillRadius] = useState([10]);
  const [prevKillRadius, setPrevKillRadius] = useState([10]);

  const [killCooldown, setKillCooldown] = useState([60]);
  const [prevKillCooldown, setPrevKillCooldown] = useState([60]);

  const [impostorNum, setImpostorNum] = useState([1]);
  const [prevImpostorNum, setPrevImpostorNum] = useState([1]);

  const [votingTimer, setVotingTimer] = useState([60]);
  const [prevVotingTimer, setPrevVotingTimer] = useState([60]);

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

      const isHost = state.players.find(
        (p) => p.sessionId === room.sessionId
      ).isHost;
      setIsHost(isHost);

      // If not host, update this info
      // (Host has control over this info on their end)
      if (!isHost) {
        setKillRadius(state.settings.killRadius);
        setKillCooldown(state.settings.killCooldown);
        setImpostorNum(state.settings.impostorNum);
        setVotingTimer(state.settings.votingTimer);
      }
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
      // DEV: don't leave immediately
      // leaveGameRoom();
    };
  }, []);

  function storePrev() {
    setPrevKillRadius(killRadius);
    setPrevKillCooldown(killCooldown);
    setPrevImpostorNum(impostorNum);
    setPrevVotingTimer(votingTimer);
  }

  function dontSave() {
    setKillRadius(prevKillRadius);
    setKillCooldown(prevKillCooldown);
    setImpostorNum(prevImpostorNum);
    setVotingTimer(prevVotingTimer);
    getGameRoom().send('settingsUpdated', {
      killRadius: prevKillRadius[0],
      killCooldown: prevKillCooldown[0],
      impostorNum: prevImpostorNum[0],
      votingTimer: prevVotingTimer[0],
    });
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

  function settingsUpdated() {
    getGameRoom().send('settingsUpdated', {
      killRadius: killRadius[0],
      killCooldown: killCooldown[0],
      impostorNum: impostorNum[0],
      votingTimer: votingTimer[0],
    });
  }

  const startGame = () => {
    // In theory, only the host can click the "start game" button
    // But let's do this check anyway
    console.assert(isHost);

    // Tell server to start game
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    getGameRoom().send('startGame');
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
        style={styles.lobbyContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        enabled={false}
      >
        <View style={styles.settingsContainer}>
          <TouchableOpacity accessibilityRole="button" onPress={handleModal}>
            <Image
              style={styles.settingsIcon}
              source={require('client/assets/settings.png')}
            />
          </TouchableOpacity>
          <TextInput
            style={styles.nameInputContainer}
            onChangeText={changeNameText}
            placeholder="Username"
            maxLength={16}
            autoComplete="off"
            autoCorrect={false}
          />
          <CustomText textSize={50}>Code: {roomCode}</CustomText>
        </View>

        <View style={styles.playerContainer}>
          <FlatList
            data={memberList}
            renderItem={({ item }) => (
              <TouchableWithoutFeedback>
                <View style={styles.playerItem}>
                  <ProfileIcon
                    player={item}
                    size={50}
                    style={{ marginRight: 10 }}
                  />
                  <CustomText textSize={50}>
                    {item.username || 'Anonymous'}
                    {item.isHost && ' (Host)'}
                  </CustomText>
                </View>
              </TouchableWithoutFeedback>
            )}
          />
        </View>

        <View style={styles.bodyContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={startGame}
            disabled={!isHost || getGameRoom().state.players.length < 1}
          >
            <CustomText textSize={45}>
              {isHost
                ? getGameRoom().state.players.length > 1
                  ? 'Start Game'
                  : 'Not enough players...'
                : 'Waiting on host...'}
            </CustomText>
          </TouchableOpacity>
        </View>

        <Modal
          isVisible={isModalVisible}
          animationType="slide"
          onShow={storePrev}
        >
          <View style={styles.settingsModal}>
            <View style={styles.settingsModalSettings}>
              <CustomText textSize={60} centerText={true} marginVertical={40}>
                Settings
              </CustomText>
              <View>
                <CustomText centerText={true} textSize={40}>
                  Kill Radius: {killRadius}m
                </CustomText>
                <Slider
                  value={killRadius}
                  minimumValue={2}
                  maximumValue={100}
                  step={1}
                  onValueChange={(killRadius) => {
                    setKillRadius(killRadius);
                    settingsUpdated();
                  }}
                  trackClickable={true}
                  disabled={!isHost}
                />
              </View>
              <View>
                <CustomText centerText={true} textSize={40}>
                  Kill Cooldown: {killCooldown}s
                </CustomText>
                <Slider
                  value={killCooldown}
                  minimumValue={10}
                  maximumValue={240}
                  step={10}
                  onValueChange={(killCooldown) => {
                    setKillCooldown(killCooldown);
                    settingsUpdated();
                  }}
                  trackClickable={true}
                  disabled={!isHost}
                />
              </View>
              <View>
                <CustomText centerText={true} textSize={40}>
                  Number of Impostors: {impostorNum}
                </CustomText>
                <Slider
                  value={impostorNum}
                  minimumValue={30}
                  maximumValue={120}
                  step={5}
                  onValueChange={(impostorNum) => {
                    setImpostorNum(impostorNum);
                    settingsUpdated();
                  }}
                  trackClickable={true}
                  disabled={!isHost}
                />
              </View>
              <View>
                <CustomText centerText={true} textSize={40}>
                  Voting Timer: {votingTimer}s
                </CustomText>
                <Slider
                  value={votingTimer}
                  minimumValue={10}
                  maximumValue={240}
                  step={10}
                  onValueChange={(votingTimer) => {
                    setVotingTimer(votingTimer);
                    settingsUpdated();
                  }}
                  trackClickable={true}
                  disabled={!isHost}
                />
              </View>
            </View>

            {isHost ? (
              <View style={styles.settingsModalExit}>
                <TouchableOpacity onPress={handleModal} style={styles.button}>
                  <CustomText textSize={45}>Close and Save</CustomText>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    handleModal();
                    dontSave();
                  }}
                  style={styles.button}
                >
                  <CustomText color={'red'} textSize={45}>
                    Close and Don't Save
                  </CustomText>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    leaveGameRoom();
                    Haptics.notificationAsync(
                      Haptics.NotificationFeedbackType.Warning
                    );
                    navigation.navigate('Menu');
                  }}
                  style={[styles.button]}
                >
                  <CustomText color={'red'} textSize={45}>
                    Leave Room
                  </CustomText>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.settingsModalExit}>
                <TouchableOpacity onPress={handleModal} style={styles.button}>
                  <CustomText textSize={45}>Close</CustomText>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    leaveGameRoom();
                    Haptics.notificationAsync(
                      Haptics.NotificationFeedbackType.Warning
                    );
                    navigation.navigate('Menu');
                  }}
                  style={[styles.button]}
                >
                  <CustomText color={'red'} textSize={45}>
                    Leave Room
                  </CustomText>
                </TouchableOpacity>
              </View>
            )}
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
  nameInputContainer: {
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

  settingsModal: {
    backgroundColor: 'white',
    borderRadius: 20,
    flex: 1,
    color: 'white',
    alignItems: 'center',
    marginVertical: 25,
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
    width: '110%', // Cheeky override for the fact that default button width is 80%
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
  playerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#000',
    borderWidth: 2,
    borderRadius: 10,
    margin: 10,
    padding: 10,
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
    margin: 40,
  },
  redText: {
    color: 'red',
    fontSize: 45,
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
  disabled: {
    display: 'none',
  },
});

export { LobbyScreen };
