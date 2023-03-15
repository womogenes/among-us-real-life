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
  ScrollView,
  FlatList,
} from 'react-native';
import Constants from 'expo-constants';
import Modal from 'react-native-modal';
import { StatusBar } from 'expo-status-bar';
import { Slider } from '@miblanchard/react-native-slider';

import { getGameRoom } from '../networking.js';

function LobbyScreen({ navigation }) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const handleModal = () => setIsModalVisible(() => !isModalVisible);

  const [killRadius, setKillRadius] = useState(5);
  const [killCooldown, setKillCooldown] = useState(60);
  const [prevKillRadius, setPrevKillRadius] = useState(5);
  const [prevKillCooldown, setPrevKillCooldown] = useState(60);

  const [roomState, setRoomState] = useState({});
  const [roomCode, setRoomCode] = useState('XXXX');

  useEffect(() => {
    // NETWORKING STUFF
    const room = getGameRoom();

    room.onStateChange((state) => {
      setRoomState(state);
      setRoomCode(state.code);
    });

    return () => {
      room.removeAllListeners();
    };
  }, []);

  function storePrev() {
    setPrevKillRadius(killRadius);
    setPrevKillCooldown(killCooldown);
    console.log('Hi' + prevKillRadius);
  }

  function dontSave() {
    console.log(prevKillRadius);
    setKillRadius(prevKillRadius);
    setKillCooldown(prevKillCooldown);
  }

  let nameList = ['You', 'Devin', 'Dan', 'Julie', 'Jackson'];

  const userList = [];
  for (let i = 0; i < 5; i++) {
    userList[i] = { key: nameList[i] };
  }
  const [memberList, setMemberList] = useState(userList);

  const [name, setName] = useState('');

  function changeNameText(changedName) {
    setName(changedName);

    let newMemberList = [...memberList];
    newMemberList[0] = { key: name };
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
            placeholder="Username..."
            maxLength={16}
            autoComplete={false}
            autoCorrect={false}
          />

          <Text style={styles.codeText}>Code: {roomCode}</Text>
        </View>

        <View style={styles.playerContainer}>
          <FlatList
            data={memberList}
            renderItem={({ item }) => (
              <Text style={styles.item}>{item.key}</Text>
            )}
          />
        </View>

        <View style={styles.bodyContainer}>
          <TouchableOpacity style={styles.button} onPress={startGame}>
            <Text style={styles.buttonText}>Start Game</Text>
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
    marginTop: '5%',
  },
  settingsModalSettings: {
    width: '80%',
    flex: 0.8,
  },
  settingsModalText: {
    fontSize: 20,
    paddingTop: 10,
    textAlign: 'center',
  },
  settingsModalExit: {
    paddingTop: 20,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 0.2,
  },
  playerContainer: {
    backgroundColor: '#7ABAFA',
    flex: 0.7,
  },
  bodyContainer: {
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
    marginBottom: 20,
  },
  closeDontSave: {
    backgroundColor: '#BDC9C9',
    padding: 10,
    borderRadius: 20,
    width: '80%',
    height: '40%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  buttonText: {
    fontSize: 22,
  },
  dontSaveText: {
    color: 'red',
    fontSize: 22,
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
