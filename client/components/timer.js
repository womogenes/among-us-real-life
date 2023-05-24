import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Animated,
} from 'react-native';

import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';

import { useRef, useEffect, useState } from 'react';

import CustomText from '../components/text.js';

import Easing from 'react-native/Libraries/Animated/Easing';

function Timer(props) {
  function completion() {
    console.log('sabotage successful, end game');
  }

  return (
    <View
      style={[
        styles.container,
        props.playing ? { opacity: 1 } : { opacity: 0 },
      ]}
    >
      {props.playing && (
        <CountdownCircleTimer
          size={120}
          isPlaying={props.playing}
          duration={180}
          colors={['#00e808', '#ffe51f', '#f7f723', '#ff2200', '#6b0000']}
          colorsTime={[180, 80, 50, 20, 0]}
          onComplete={() => [completion(), { shouldRepeat: false }]}
          updateInterval={1}
        >
          {({ remainingTime, color }) => (
            <CustomText
              textSize={70}
              textColor={color}
              style={[{ textShadowColor: '#000000' }, { textShadowRadius: 2 }]}
            >
              {remainingTime}
            </CustomText>
          )}
        </CountdownCircleTimer>
      )}
    </View>
  );
}

export default Timer;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    backgroundColor: '#ffffff99',
    width: 120,
    height: 120,
    borderRadius: 100,
    margin: 10,
    top: 50,
    right: 0,
  },
});
