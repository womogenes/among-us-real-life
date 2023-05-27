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
  Switch,
  ScrollView,
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

  const [killCooldown, setKillCooldown] = useState([20]);
  const [prevKillCooldown, setPrevKillCooldown] = useState([20]);

  const [saboCooldown, setSaboCooldown] = useState([180]);
  const [prevSaboCooldown, setPrevSaboCooldown] = useState([20]);

  const [impostorNum, setImpostorNum] = useState([1]);
  const [prevImpostorNum, setPrevImpostorNum] = useState([1]);

  const [votingTimer, setVotingTimer] = useState([30]);
  const [prevVotingTimer, setPrevVotingTimer] = useState([30]);

  const [playerSight, setPlayerSight] = useState([100]);
  const [prevPlayerSight, setPrevPlayerSight] = useState([100]);

  const [anonVotes, setAnonVotes] = useState([false]);
  const [prevAnonVotes, setPrevAnonVotes] = useState([false]);

  const [impostorLimit, setImpostorLimit] = useState([1]);

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

      if (room.state.players.length <= 3) {
        setImpostorLimit(1);
      } else {
        setImpostorLimit(Math.ceil(room.state.players.length / 2) - 1);
      }

      // If not host, update this info
      // (Host has control over this info on their end)
      if (!isHost) {
        setKillRadius(state.settings.killRadius);
        setKillCooldown(state.settings.killCooldown);
        setSaboCooldown(state.settings.saboCooldown);
        setImpostorNum(state.settings.impostorNum);
        setVotingTimer(state.settings.votingTimer);
        setAnonVotes(state.settings.anonVotes);
        setPlayerSight(state.settings.playerSight);
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

  function reset() {
    setKillRadius(10);
    setKillCooldown(20);
    setSaboCooldown(180);
    setImpostorNum(1);
    setVotingTimer(30);
    setAnonVotes(false);
    setPlayerSight(100);
  }

  function storePrev() {
    setPrevKillRadius(killRadius);
    setPrevKillCooldown(killCooldown);
    setPrevSaboCooldown(saboCooldown);
    setPrevImpostorNum(impostorNum);
    setPrevVotingTimer(votingTimer);
    setPrevAnonVotes(anonVotes);
    setPrevPlayerSight(playerSight);
  }

  function dontSave() {
    setKillRadius(prevKillRadius);
    setKillCooldown(prevKillCooldown);
    setSaboCooldown(prevSaboCooldown);
    setImpostorNum(prevImpostorNum);
    setVotingTimer(prevVotingTimer);
    setAnonVotes(prevAnonVotes);
    setPlayerSight(prevPlayerSight);
    getGameRoom().send('settingsUpdated', {
      killRadius: prevKillRadius[0],
      killCooldown: prevKillCooldown[0],
      saboCooldown: prevSaboCooldown[0],
      impostorNum: prevImpostorNum[0],
      votingTimer: prevVotingTimer[0],
      anonVotes: prevAnonVotes[0],
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
    console.log(impostorNum[0]);
    getGameRoom().send('settingsUpdated', {
      killRadius: killRadius[0],
      killCooldown: killCooldown[0],
      saboCooldown: saboCooldown[0],
      impostorNum: impostorNum[0],
      votingTimer: votingTimer[0],
      anonVotes: anonVotes[0],
      playerSight: playerSight[0],
    });
  }

  const startGame = () => {
    // In theory, only the host can click the "start game" button
    // But let's do this check anyway
    console.assert(isHost);

    // !! HACK !! for development only
    if (
      true ||
      Math.ceil(getGameRoom().state.players.length / 2) > impostorNum
    ) {
      // Tell server to start game
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      getGameRoom().send('startGame');
    } else {
      console.log('IMPOSTER BROKE');
    }
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
                ? getGameRoom().state.players.length > 2
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
              <ScrollView>
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
                    maximumValue={120}
                    step={5}
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
                    Sabotage Cooldown: {saboCooldown}s
                  </CustomText>
                  <Slider
                    value={saboCooldown}
                    minimumValue={120}
                    maximumValue={300}
                    step={5}
                    onValueChange={(saboCooldown) => {
                      setSaboCooldown(saboCooldown);
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
                    minimumValue={1}
                    maximumValue={impostorLimit}
                    step={1}
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
                    maximumValue={180}
                    step={10}
                    onValueChange={(votingTimer) => {
                      setVotingTimer(votingTimer);
                      settingsUpdated();
                    }}
                    trackClickable={true}
                    disabled={!isHost}
                  />
                </View>
                <View>
                  <CustomText centerText={true} textSize={40}>
                    Player Sight: {playerSight}m
                  </CustomText>
                  <Slider
                    value={playerSight}
                    minimumValue={50}
                    maximumValue={200}
                    step={10}
                    onValueChange={(playerSight) => {
                      setPlayerSight(playerSight);
                      settingsUpdated();
                    }}
                    trackClickable={true}
                    disabled={!isHost}
                  />
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    flex: 1,
                    justifyContent: 'center',
                  }}
                >
                  <CustomText centerText={true} textSize={40}>
                    Anonymous Votes
                  </CustomText>
                  <Switch
                    style={{
                      marginTop: 8,
                      marginLeft: 15,
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginBottom: 60,
                    }}
                    trackColor={{ false: '#888', true: '#666' }}
                    thumbColor={anonVotes ? '#fff' : '#fff'}
                    onValueChange={() => setAnonVotes(!anonVotes)}
                    value={anonVotes}
                  />
                </View>
                <View style={styles.reset}>
                  <TouchableOpacity
                    onPress={() => reset()}
                    disabled={!isHost}
                  >
                    <CustomText centerText={true} textSize={40} textColor={'red'}>Reset</CustomText>
                  </TouchableOpacity>
                </View>
                <View style={styles.endSpace}>
                </View>
              </ScrollView>
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
  reset: {
    margin: -30,
  },
  endSpace: {
    margin: 50,
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
