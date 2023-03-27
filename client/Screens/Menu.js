import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';
import { React, useEffect, useState } from 'react';

import { connectToGameRoom, getLobbyRoom } from '../networking.js';

function MenuScreen({ navigation }) {
  const joinGame = () => {
    navigation.navigate('Join');
  };

  const toLobby = () => {
    // Request a game room
    const lobby = getLobbyRoom();
    lobby?.send('createNewGame');

    lobby?.onMessage('gameCreated', async (code) => {
      await connectToGameRoom(code);
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
          <Text numberOfLines={1} style={styles.titleText}>
            AMONG US
          </Text>
          <Text numberOfLines={1} style={styles.lakesideText}>
            (Lakeside Edition)
          </Text>
        </View>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.button} onPress={joinGame}>
            <Text style={styles.buttonText}>Join</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={toLobby}>
            <Text style={styles.buttonText}>Create</Text>
          </TouchableOpacity>
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
  titleText: {
    fontSize: 100,
    letterSpacing: 3,
    fontFamily: 'Impostograph-Regular',
  },
  lakesideText: {
    fontSize: 40,
    fontFamily: 'Impostograph-Regular',
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
  buttonText: {
    color: 'black',
    fontSize: 40,
    fontFamily: 'Impostograph-Regular',
  },
});

export { MenuScreen };
