import React, { useState, useEffect, useRef } from 'react';
import MaskedView from '@react-native-masked-view/masked-view';
import { StyleSheet, View, TouchableOpacity, Animated, Text, Image } from 'react-native';
import Easing from 'react-native/Libraries/Animated/Easing';
import Modal from 'react-native-modal';
import CustomText from '../text.js';

function ScanTask({ active, complete, closeTask }) {

  const [timer, setTimer] = useState(null);
  const [intervalID, setIntervalID] = useState();

  const [rectangle, setRectangle] = useState({
    bottom: new Animated.Value(-10),
    height: new Animated.Value(0),
  });

  const [loading, setLoading] = useState({
    height: new Animated.Value(0),
  })

  function newTimer() {
    setTimer(10);
    const interval = setInterval(() => {
      setTimer((prevState) => prevState - 1);
    }, 1000);
    setIntervalID(interval);
  }

  function clearTimer() {
    clearInterval(intervalID);
    setTimer(null);
  }

  const toggleScan = useRef(
      Animated.loop(
        Animated.parallel([
          Animated.sequence([
            Animated.timing(rectangle.height, {
              toValue: 100,
              duration: 1000,
              useNativeDriver: false,
              easing: Easing.inOut(Easing.sin),
            }),
            Animated.timing(rectangle.height, {
              toValue: 20,
              duration: 1000,
              useNativeDriver: false,
              easing: Easing.inOut(Easing.sin),
            }),
          ]),
          Animated.sequence([
            Animated.timing(rectangle.bottom, {
              toValue: 100,
              duration: 1000,
              useNativeDriver: false,
              easing: Easing.inOut(Easing.sin),
            }),
            Animated.timing(rectangle.bottom, {
              toValue: -10,
              duration: 1000,
              useNativeDriver: false,
              easing: Easing.inOut(Easing.sin),
            }),
          ])
        ])
      )
  ).current;

  const toggleLoad = useRef(
    Animated.timing(loading.height, {
      toValue: 100,
      duration: 10000,
      useNativeDriver: false,
      easing: Easing.inOut(Easing.sin),
    }),
  ).current;

const resetAnimations = useRef(
  Animated.parallel([
    Animated.timing(rectangle.height, {
      toValue: 200,
      duration: 0,
      useNativeDriver: false,
      easing: Easing.inOut(Easing.sin),
    }),
    Animated.timing(rectangle.bottom, {
      toValue: -10,
      duration: 0,
      useNativeDriver: false,
      easing: Easing.inOut(Easing.sin),
    }),
    Animated.timing(loading.height, {
      toValue: 0,
      duration: 0,
      useNativeDriver: false,
      easing: Easing.inOut(Easing.sin),
    }),
  ])
).current;

useEffect(() => {
  if(active){
    rectangle.height.setValue(200);
    rectangle.bottom.setValue(-10);
    loading.height.setValue(0);
    clearTimer();
  }
},[active]);

useEffect(() => {
  if (timer <= 0 && timer != null) {
    clearTimer();
    setTimeout(() => {
      rectangle.height.setValue(200);
      rectangle.bottom.setValue(-10);
      loading.height.setValue(0);
      complete('reactor');
      closeTask();
    }, 1000);
  }
}, [timer]);

  return (
    <Modal isVisible={active}>
      <View style={styles.modal}>
        <Animated.View style={[styles.loading, {height: parseFloat(JSON.stringify(loading.height)) + '%'}]}>
        </Animated.View>
        <View style={styles.textBox}>
          <CustomText textSize={30}>
            {timer? 'scanning... ' + Math.round(JSON.stringify(loading.height)) + '%': JSON.stringify(loading.height) >= 100? 'scan complete!': 'waiting for scan...'}
          </CustomText>
        </View>
        <TouchableOpacity
            style={styles.closeButton}
            onPress={() => [resetAnimations.start(), setTimeout(() => {closeTask('passcode');}, 10)]}
        >
            <CustomText textSize={30}>&#10006;</CustomText>
        </TouchableOpacity>
        <View style={styles.container}>
          <TouchableOpacity style={styles.button} onPressIn={() => [toggleScan.start(), toggleLoad.start(), newTimer()]} onPressOut={() => [resetAnimations.start(), clearTimer()]}>
            <MaskedView
              style={styles.container2}
              maskElement={
                <View style={styles.container3}>
                  <Image style={styles.image} source={require('../../assets/fingerprint.png')}/>
                </View>
              }
            >
              <Animated.View style={[styles.blueLine, {bottom: rectangle.bottom}, {height: rectangle.height}]}>                 
              </Animated.View>
            </MaskedView>
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
    overflow: 'hidden',
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
    backgroundColor: "#525252",
    alignItems: 'center',
    justifyContent: 'center',
    margin: 20,
  },
  container: {
    height: '100%',
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    position: 'absolute',
  },
  container2: {
    height: '100%',
    flex: 1,
    flexDirection: 'row',
  },
  container3: {
    height: '100%',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 75,
    height: 75,
  },
  blueLine: {
    position: 'absolute',
    backgroundColor: '#03fcdf',
    width: '100%',
    opacity: 0.8,
    left: -50,
  },
  loading: {
    position: 'absolute',
    backgroundColor: '#00916d',
    bottom: 0,
    width: '100%',
  },
  textBox: {
    position: 'absolute',
    width: 150,
    height: 50,
    margin: 15,
    backgroundColor: '#808080',
    borderWidth: 2,
    borderColor: '#b1b5b4',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
