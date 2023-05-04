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

  function col(arr) {
    return arr.map((num) => {
      let key = Math.random();
      if(num === '×'){
        return (
          <TouchableOpacity
            style={styles.button}
            onPress={() => deleteValue()}
            key={key}
          >
            <CustomText textSize={60} textColor={'red'} key={key}>{num}</CustomText>
          </TouchableOpacity>
        )
      }
      else if(num === '○'){
        return (
          <TouchableOpacity
            style={styles.button}
            onPress={() => verifyValue()}
            key={key}
          >
            <CustomText textSize={50} textColor={'green'} key={key}>{num}</CustomText>
          </TouchableOpacity>
        )
      }
      else{
        return (
          <TouchableOpacity
            style={styles.button}
            onPress={() => changeValue(num)}
            key={key}
          >
            <CustomText textSize={60} key={key}>{num}</CustomText>
          </TouchableOpacity>
        )
      }
    })
  }
  function keypad() {
    let keypad = [[1, 2, 3], [4, 5, 6], [7, 8, 9], ['×', 0, '○']]
    
    return keypad.map((arr) => {
      return(
        <View style={styles.buttonContainer} key={Math.random()}>
          {col(arr)}
        </View>
      )
    })
  }

  function keyNum() {
    let keyNums = [one, two, three, four];
    return keyNums.map((variable) => {
      return(
        <CustomText
          textSize={60}
          letterSpacing={1}
          textColor={'red'}
          centerText={'center'}
          flex={1}
          key={Math.random()}
        >
          {variable}
        </CustomText>
      )
    })
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
          {keyNum()}
        </View>
        {keypad()}
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
    }
});
