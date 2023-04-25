import { StatusBar } from 'expo-status-bar';
import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import Modal from 'react-native-modal';
import CustomText from '../text.js';

function CodeTask({ active, code, complete, closeTask }) {
  const [counter, setCounter] = useState(1);
  const [one, setOne] = useState('#');
  const [two, setTwo] = useState('#');
  const [three, setThree] = useState('#');
  const [four, setFour] = useState('#');

  function changeValue(value) {
    if (counter == 1) {
      setOne(value);
      setCounter(counter + 1);
    }
    if (counter == 2) {
      setTwo(value);
      setCounter(counter + 1);
    }
    if (counter == 3) {
      setThree(value);
      setCounter(counter + 1);
    }
    if (counter == 4) {
      setFour(value);
      setCounter(counter + 1);
    }
  }

  function deleteValue() {
    if (counter == 2) {
      setOne('#');
      setCounter(1);
    }
    if (counter == 3) {
      setTwo('#');
      setCounter(2);
    }
    if (counter == 4) {
      setThree('#');
      setCounter(3);
    }
    if (counter == 5) {
      setFour('#');
      setCounter(4);
    }
  }

  function verifyValue() {
    if (one * 1000 + two * 100 + three * 10 + four == code) {
      console.log('success!');
    }
  }

  return (
    <Modal isVisible={active}>
      <View style={styles.modal}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => closeTask('passcode')}
        >
          <CustomText textSize={30}>&#10006;</CustomText>
        </TouchableOpacity>
        <View style={styles.inputContainer}>
          <CustomText
            textSize={60}
            letterSpacing={1}
            textColor={'red'}
            centerText={'center'}
            flex={1}
          >
            {one}
          </CustomText>
          <CustomText
            textSize={60}
            letterSpacing={1}
            textColor={'red'}
            centerText={'center'}
            flex={1}
          >
            {two}
          </CustomText>
          <CustomText
            textSize={60}
            letterSpacing={1}
            textColor={'red'}
            centerText={'center'}
            flex={1}
          >
            {three}
          </CustomText>
          <CustomText
            textSize={60}
            letterSpacing={1}
            textColor={'red'}
            centerText={'center'}
            flex={1}
          >
            {four}
          </CustomText>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => changeValue(1)}
          >
            <CustomText textSize={60}>1</CustomText>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => changeValue(2)}
          >
            <CustomText textSize={60}>2</CustomText>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => changeValue(3)}
          >
            <CustomText textSize={60}>3</CustomText>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => changeValue(4)}
          >
            <CustomText textSize={60}>4</CustomText>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => changeValue(5)}
          >
            <CustomText textSize={60}>5</CustomText>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => changeValue(6)}
          >
            <CustomText textSize={60}>6</CustomText>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => changeValue(7)}
          >
            <CustomText textSize={60}>7</CustomText>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => changeValue(8)}
          >
            <CustomText textSize={60}>8</CustomText>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => changeValue(9)}
          >
            <CustomText textSize={60}>9</CustomText>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={() => deleteValue()}>
            <CustomText textSize={60} textColor={'red'}>
              ×
            </CustomText>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => changeValue(0)}
          >
            <CustomText textSize={60}>0</CustomText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => verifyValue()}>
            <CustomText textSize={50} textColor={'green'}>
              ○
            </CustomText>
          </TouchableOpacity>
        </View>
        <View style={styles.hintContainer}>
          <CustomText textSize={40}>HINT:</CustomText>
          <CustomText textSize={60} centerText={'center'}>
            {code}
          </CustomText>
        </View>
      </View>
    </Modal>
  );
}

export default CodeTask;

const styles = StyleSheet.create({
  modal: {
    margin: 20,
    borderRadius: 20,
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    color: '#000',
    padding: 20,
  },
  inputContainer: {
    marginTop: 20,
    marginBottom: 20,
    width: '80%',
    height: 80,
    borderWidth: 5,
    borderColor: 'black',
    backgroundColor: 'white',
    flexDirection: 'row',
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
    height: '13%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    flex: 1,
    height: '95%',
    borderWidth: 5,
    borderRadius: 20,
    margin: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hintContainer: {
    flex: 1,
    marginTop: 20,
    width: '50%',
    backgroundColor: '#f7dd14',
    padding: 20,
  },
  closeButton: {
    position: 'absolute',
    right: 0,
    top: 0,
    margin: 10,
  },
});
