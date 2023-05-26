import React, { useState, useEffect } from 'react';
import { RNHoleView } from 'react-native-hole-view';
import { StyleSheet, View, TouchableOpacity, Animated, Text, Image } from 'react-native';
import Easing from 'react-native/Libraries/Animated/Easing';
import Modal from 'react-native-modal';
import CustomText from '../text.js';

function ScanTask({ active, complete, closeTask }) {

  const [flash, setFlash] = useState({
    opacity: new Animated.Value(0),
  });


  return (
    <Modal isVisible={active}>
      <View style={styles.modal}>
        <TouchableOpacity
            style={styles.closeButton}
            onPress={() => closeTask('passcode')}
          >
            <CustomText textSize={30}>&#10006;</CustomText>
        </TouchableOpacity>
        <View style={styles.container}>
          <RNHoleView
            style={styles.transparentWindow}
            holes={[{x: 100, y: 100, width: 90, height: 90, borderRadius: 100}]}
          >

          </RNHoleView>
          <TouchableOpacity style={styles.button}>
            <Animated.View style={[styles.blueLine]}>
              
            </Animated.View>
            <Image style={styles.image} source={require('../../assets/fingerprint.png')}/>
          </TouchableOpacity> 
        </View>    
      </View>
    </Modal>
  );
}

export default ScanTask;

const styles = StyleSheet.create({
  modal: {
    margin: 50,
    marginTop: 200,
    marginBottom: 200,
    borderRadius: 20,
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    color: '#000',
  },
  closeButton: {
    position: 'absolute',
    right: 0,
    top: 0,
    margin: 10,
  },
  button: {
    width: 90,
    height: 90,
    borderRadius: 100,
    backgroundColor: "black",
    alignItems: 'center',
    justifyContent: 'center',
    margin: 20,
  },
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'red',
  },
  transparentWindow: {
    position: 'absolute',
    flex: 1,
    backgroundColor: 'white',
  },
  image: {
    width: 75,
    height: 75,
  },
  blueLine: {
    position: 'absolute',
    backgroundColor: '#03fcdf',
    height: 20,
    width: '100%',
    opacity: 0.8,
    bottom: 0,
  },
});
