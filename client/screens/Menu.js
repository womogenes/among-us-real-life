import {
  StyleSheet,
  View,
  ImageBackground,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';
import { React, useEffect, useState } from 'react';
import * as Haptics from 'expo-haptics';

import {
  connectToGameRoom,
  getLobbyRoom,
  connectToServer,
} from '../networking.js';

import CustomText from '../components/text.js';
import CustomButton from '../components/button.js';
import { ProfileIcon } from '../components/profile-icon.js';

function MenuScreen({ navigation }) {
  const [connected, setConnected] = useState('notConnected');

  const onConnectPressed = async () => {
    console.log('hello');
    setConnected('connecting');

    await connectToServer();
    setConnected('connected');
  };

  const joinGame = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    navigation.navigate('Join');
  };

  const toLobby = () => {
    // Request a game room
    const lobby = getLobbyRoom();
    lobby?.send('createNewGame');

    lobby?.onMessage('gameCreated', async (code) => {
      await connectToGameRoom(code);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      navigation.navigate('Lobby');

      lobby.removeAllListeners();
    });
  };

  return (
    <View style={styles.menuContainer}>
      <ImageBackground
        source={require('client/assets/menuBackground.png')}
        resizeMode="cover"
        style={styles.backgroundImage}
      >
        <View style={styles.titleContainer}>
          <CustomText numberOfLines={1} textSize={100} letterSpacing={3}>
            AMONG US
          </CustomText>
          <CustomText numberOfLines={1} textSize={40}>
            (Lakeside Edition)
          </CustomText>
        </View>
        <View style={styles.buttonsContainer}>
          {connected != 'connected' && (
            <>
              <CustomText textSize={30} textColor="#fff">
                Please switch to mobile data.
              </CustomText>
              <TouchableOpacity
                style={styles.button}
                onPress={onConnectPressed}
              >
                <CustomText textSize={40}>
                  {connected === 'notConnected'
                    ? 'Connect to server'
                    : connected === 'connecting'
                    ? 'Connecting...'
                    : 'Connected'}
                </CustomText>
              </TouchableOpacity>
            </>
          )}

          {connected === 'connected' && (
            <>
              <TouchableOpacity style={styles.button} onPress={joinGame}>
                <CustomText textSize={40}>Join</CustomText>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={toLobby}>
                <CustomText textSize={40}>Create</CustomText>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    width: '100%',
    height: '100%',
    flexDirection: 'column',
  },
  titleContainer: {
    flex: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonsContainer: {
    color: '#505050',
    flex: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#BDC9C9',
    width: '65%',
    height: '15%',
    margin: 20,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export { MenuScreen };
