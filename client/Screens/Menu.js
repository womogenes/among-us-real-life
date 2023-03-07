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
import Modal from 'react-native-modal';

function MenuScreen({ navigation }) {
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
    flexDirection: 'column',
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
  },
  titleContainer: {
    backgroundColor: 'red',
    flex: 0.4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleText: {
    fontWeight: 'bold',
    fontSize: 50,
    letterSpacing: 3,
  },
  lakesideText: {
    color: 'black',
    flex: 2,
    fontSize: 20,
    textAlign: 'center',
  },
  buttonsContainer: {
    color: '#505050',
    flex: 0.6,
  },
  button: {
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
  emptyTouchableView: {
    flex: 4,
  },
  touchableButton: {
    color: 'black',
    fontSize: 17,
    justifyContent: 'center',
  },
});

export { MenuScreen };
