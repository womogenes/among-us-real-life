import {
  StyleSheet,
  Button,
  Text,
  View,
  ImageBackground,
  TouchableOpacity,
  Touchable,
} from 'react-native';
import React, { useState } from 'react';

function MenuScreen({ navigation }) {
  return (
    <View style={styles.menuContainer}>
      <ImageBackground
        source={require('client/assets/menuBackground.png')}
        resizeMode="cover"
        style={styles.backgroundImage}
      >
        <View style={{ flex: 1, backgroundColor: 'transparent' }} />
        <Text style={styles.titleText}>Among Us</Text>
        <Text style={styles.lakesideText}>(Lakeside Edition)</Text>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Lobby')}
          >
            <Text style={styles.touchableButton}>Join</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Lobby')}
          >
            <Text style={styles.touchableButton}>Public</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Lobby')}
          >
            <Text style={styles.touchableButton}>Create</Text>
          </TouchableOpacity>
          <View style={styles.emptyTouchableView}></View>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  menuContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleText: {
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
    fontSize: '50px',
    flex: 0.5,
    letterSpacing: '3px',
  },
  buttonsContainer: {
    color: '#505050',
    flex: 2,
  },
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  button: {
    textColor: 'white',

    alignItems: 'center',
    backgroundColor: '#BDC9C9',
    flex: 1,
    marginTop: 20,
    marginBottom: 10,
    marginLeft: 70,
    marginRight: 70,
    paddingTop: 15,
    paddingBottom: 15,
    borderRadius: 20,
  },
  lakesideText: {
    color: 'black',
    flex: 2,
    fontSize: '20px',
    textAlign: 'center',
  },
  emptyTouchableView: {
    flex: 4,
  },
  touchableButton: {
    color: 'black',
    fontSize: '17px',
    justifyContent: 'center',
  },
});

export { MenuScreen };
