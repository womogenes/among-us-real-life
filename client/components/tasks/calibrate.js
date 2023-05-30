import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, TouchableOpacity, Animated, Text } from 'react-native';
import Easing from 'react-native/Libraries/Animated/Easing';
import Modal from 'react-native-modal';
import CustomText from '../text.js';

function CalibrateTask({ active, complete, closeTask }) {

  let animatedValue;

  const [rotation, setRotation] = useState({
    rotate: new Animated.Value(0),
  })

  const [selector, setSelector] = useState(1);

  const toggleRotation = useRef(
    Animated.loop(
      Animated.timing(rotation.rotate, {
        toValue: 360,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    )
  ).current;

const spin = rotation.rotate.interpolate({
  inputRange: [0, 360],
  outputRange: ['0deg', '360deg']
})

rotation.rotate.addListener((value) => (animatedValue = value.value));

function checkAccuracy() {
  if((animatedValue >= 350 && animatedValue <= 360) || (animatedValue >= 0 && animatedValue <= 10)){
    if(selector >= 3){
      setSelector(selector + 1);
      setTimeout(() => {
        complete();
        closeTask();
      }, 100)
    }
    else{
      toggleRotation.reset();
      setSelector(selector + 1);
    }
  }
  else{
    if(selector != 1){
      toggleRotation.reset();
      setSelector(1);
    }
  }
}

function render(arr) {
  return arr.map((num) => {
    return(
      <View style={styles.container} key={Math.random()}>
        <View style={styles.circleContainer}>
          <View style={styles.wire1}>

          </View>
          <View style={styles.wire2}>

          </View>
          <View style={styles.connector}>

          </View>
          <Animated.View style={[styles.circle, selector == num && {transform: [{rotateZ: spin}]}, num == 1? {backgroundColor: '#ffe136'} : num==2? {backgroundColor: '#0f3df5'}: {backgroundColor: '#8deaf2'}]}>
            <View style={styles.circleShadow}>
            </View>
            <View style={styles.insideCircle}>
            </View>
            <View style={styles.rectangle}>
            </View>
          </Animated.View>
          <View style={styles.numberText}>
            <CustomText textSize={50}>
              <Text>
                {num}
              </Text>
            </CustomText>
          </View>
        </View>
        <View style={styles.buttonBack}>
        </View>
        <TouchableOpacity style={styles.button} onPress={() => [checkAccuracy()]} disabled={selector != num}>
          <View style={styles.insideButton}>
            <View style={[styles.buttonLight, selector > num? {opacity: 1, shadowOpacity: 0.9, backgroundColor: 'cyan'} : {opacity: 1, shadowOpacity: 0, backgroundColor: '#6e563f'}]}>

            </View>
          </View>
        </TouchableOpacity>
      </View>
    )

  })
}

useEffect(() => {
  if(selector < 4){
    toggleRotation.start();
  }
}, [selector])

useEffect(() => {
  if(active) {
    toggleRotation.reset();
    toggleRotation.start();
  }
  else{
    toggleRotation.stop();
    rotation.rotate.setValue(0);
    setSelector(1);
  }
},[active])

  return (
    <Modal isVisible={active}>
      <View style={styles.modal}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => [setSelector(1), closeTask()]}
        >
          <CustomText textSize={30}>&#10006;</CustomText>
        </TouchableOpacity>
        <View style={styles.masterContainer}>
          {render([1, 2, 3])}
        </View>
      </View>
    </Modal>
  );
}

export default CalibrateTask;

const styles = StyleSheet.create({
  modal: {
    margin: 20,
    marginTop: 100,
    marginBottom: 100,
    borderRadius: 20,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    color: '#000',
    padding: 20,
  },
  closeButton: {
    position: 'absolute',
    right: 0,
    top: 0,
    margin: 10,
  },
  masterContainer: {
    height: '80%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  container: {
    flex: 1,
    width: '100%',
    borderColor: 'black',
    borderWidth: 2,
    backgroundColor: '#c4c4c4',
    justifyContent: 'center',
    alignItems: 'flex-start',
    margin: 10,
  },
  circleContainer: {
    margin: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    width: 100,
    aspectRatio: 1,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  insideCircle: {
    position: 'absolute',
    width: '75%',
    aspectRatio: 1,
    borderRadius: 100,
    backgroundColor: '#c4c4c4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleShadow: {
    position: 'absolute',
    width: '82%',
    aspectRatio: 1,
    borderRadius: 100,
    backgroundColor: '#5e5e5e',
  },
  rectangle: {
    backgroundColor: '#525252',
    height: 15,
    width: 20,
    right: -50,
  },
  button: {
    backgroundColor: '#919191',
    borderWidth: 2,
    borderColor: '#2f3030',
    width: 70,
    height: 30,
    position: 'absolute',
    right: 0,
    margin: 20,
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonBack: {
    backgroundColor: '#878787',
    width: 70,
    height: 30,
    position: 'absolute',
    right: 0,
    margin: 20,
    padding: 5,
  },
  insideButton: {
    padding: 2,
    width: '100%',
    height: '100%',
    backgroundColor: '#a3a3a3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonLight: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    shadowRadius: 16,
    shadowColor: 'cyan'
  },
  numberText: {
    position: 'absolute'
  },
  connector: {
    width: 30,
    height: 30,
    backgroundColor: '#82705e',
    position: 'absolute',
    right: -20,
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },
  wire1: {
    width: 100,
    height: 2,
    backgroundColor: 'blue',
    position: 'absolute',
    right: -50,
    top: 40,
  },
  wire2: {
    width: 100,
    height: 2,
    backgroundColor: 'red',
    position: 'absolute',
    right: -50,
    top: 50,
  },
});
