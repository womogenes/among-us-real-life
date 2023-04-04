import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  FlatList,
  SafeAreaView,
  ImageBackground,
} from 'react-native';
import React, { useState, useEffect } from 'react';

import { connectToGameRoom, getLobbyRoom } from '../networking.js';

function JoinScreen({ navigation }) {
  const [code, onChangeCode] = useState('');
  const [roomList, setRoomList] = useState([]);

  const joinPressed = async (code) => {
    await connectToGameRoom(code);
    navigation.navigate('Lobby');
  };

  useEffect(() => {
    // This gets run only once
    const lobby = getLobbyRoom();

    // Keep roomList in sync with the server
    setRoomList(lobby.state.rooms);

    console.log(lobby.state.rooms);

    lobby.onStateChange((state) => {
      console.log(state.rooms.$items);
      setRoomList(state.rooms.$items);
    });

    return () => {
      lobby?.removeAllListeners();
    };
  }, [roomList]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
        style={styles.menuContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        enabled={false}
      >
        <ImageBackground
          source={require('client/assets/joinGifBackground.gif')}
          style={styles.backgroundImage}
        >
          <View style={styles.titleContainer}>
            <Text style={styles.titleText}>Join Server</Text>
          </View>
          <View style={styles.bodyContainer}>
            <TextInput
              style={styles.textInput}
              onChangeText={onChangeCode}
              placeholder="XXXX"
              placeholderTextColor={'white'}
              autoCapitalize="characters"
              autoComplete="off"
              autoCorrect={false}
              keyboardType="numeric"
              maxLength={4}
              textAlign={'center'}
            />
            <TouchableOpacity
              style={styles.button}
              disabled={!(/\d/.test(code) && code.length == 4)}
              onPress={() => {
                joinPressed(code);
              }}
            >
              <Text style={styles.touchableButton}>Join</Text>
            </TouchableOpacity>
          </View>

          {/* Room list container */}
          <SafeAreaView style={styles.roomListContainer}>
            <FlatList
              style={styles.roomList}
              data={roomList}
              renderItem={({ item }) => (
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => {
                    joinPressed(item);
                  }}
                >
                  <Text style={styles.room}>{item}</Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item}
              snapToAlignment="start"
              decelerationRate={'fast'}
            />
          </SafeAreaView>
        </ImageBackground>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  menuContainer: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
  },
  titleContainer: {
    flex: 0.2,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  titleText: {
    color: 'white',
    fontSize: 100,
    letterSpacing: 1,
    fontFamily: 'Impostograph-Regular',
  },
  bodyContainer: {
    flex: 0.3,
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#BDC9C9',
    width: '30%',
    height: '25%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  touchableButton: {
    color: 'black',
    fontSize: 40,
    fontFamily: 'Impostograph-Regular',
  },
  textInput: {
    width: '40%',
    height: '25%',
    borderWidth: 1,
    fontSize: 50,
    borderColor: 'white',
    color: 'white',
    fontFamily: 'Impostograph-Regular',
    letterSpacing: 5,
  },
  roomListContainer: {
    flex: 0.5,
    alignItems: 'center',
  },
  roomList: {
    width: '80%',
  },
  room: {
    overflow: 'hidden', // For the borderRadius
    backgroundColor: '#BDC9C9',
    borderRadius: 5,
    padding: 10,
    marginVertical: 2,
    fontSize: 30,
    fontFamily: 'Impostograph-Regular',
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    flexDirection: 'column',
  },
});

export { JoinScreen };
