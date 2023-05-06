import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Animated,
} from 'react-native';

import { useRef, useEffect, useState } from 'react';

import CustomText from '../components/text.js';

import Easing from 'react-native/Libraries/Animated/Easing';

function SabotageFlash(props) {
  const [flash, setFlash] = useState({
    opacity: new Animated.Value(0),
  });

  const [title, setTitle] = useState({
    opacity: new Animated.Value(0),
  });

  function toggleColor() {
    Animated.loop(
      Animated.sequence([
        Animated.timing(flash.opacity, {
          toValue: 0.5,
          duration: 50,
          useNativeDriver: false,
          easing: Easing.inOut(Easing.sin),
        }),
        Animated.timing(flash.opacity, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: false,
          easing: Easing.inOut(Easing.sin),
        }),
      ])
    ).start();
  }

  function toggleText() {
    Animated.sequence([
      Animated.timing(title.opacity, {
        toValue: 1,
        duration: 50,
        useNativeDriver: false,
        easing: Easing.inOut(Easing.sin),
      }),
      Animated.timing(title.opacity, {
        toValue: 1,
        duration: 5000,
        useNativeDriver: false,
        easing: Easing.inOut(Easing.sin),
      }),
      Animated.timing(title.opacity, {
        toValue: 0,
        duration: 2000,
        useNativeDriver: false,
        easing: Easing.inOut(Easing.sin),
      }),
    ]).start();
  }

  function toggleFade() {
    Animated.timing(flash.opacity, {
      toValue: 0,
      duration: 2500,
      useNativeDriver: false,
      easing: Easing.inOut(Easing.sin),
    }).start();
  }

  useEffect(() => {
    if (props.sabotageActive) {
      toggleText();
      toggleColor();
    } else {
      toggleFade();
    }
  }, [props.sabotageActive]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[styles.flash, { opacity: flash.opacity }]}
      ></Animated.View>
      <Animated.View style={[styles.title, { opacity: title.opacity }]}>
        <CustomText
          textSize={80}
          textColor={'white'}
          shadowColor={'black'}
          shadowRadius={3}
          centerText={'center'}
        >
          O2 has been Sabotaged!
        </CustomText>
      </Animated.View>
    </View>
  );
}

export default SabotageFlash;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  flash: {
    backgroundColor: 'red',
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  title: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
