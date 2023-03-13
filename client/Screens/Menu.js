import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';
import { React, useState } from 'react';

function MenuScreen({ navigation }) {
  const joinGame = () => {
    navigation.navigate('Join');
  };
  const toLobby = () => {
    navigation.navigate('Lobby');
  };

  return (
    <View style={styles.menuContainer}>
      <ImageBackground
        source={require('client/assets/menuBackground.png')}
        resizeMode="cover"
        style={styles.backgroundImage}
      >
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>Among Us</Text>
          <Text style={styles.lakesideText}>(Lakeside Edition)</Text>
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
    fontWeight: 'bold',
    fontSize: 60,
    letterSpacing: 3,
  },
  lakesideText: {
    fontSize: 20,
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
    fontSize: 27,
  },
});

export { MenuScreen };
