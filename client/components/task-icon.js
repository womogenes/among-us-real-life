import { StyleSheet, View, Image, Animated } from 'react-native';

import { useRef, useState } from 'react';

import Easing from 'react-native/Libraries/Animated/Easing';

const images = {
  reCaptcha: require('../assets/task-icons/recaptcha.png'),
  o2: require('../assets/task-icons/passcode.png'),
  memory: require('../assets/task-icons/memory.png'),
  electricity: require('../assets/task-icons/electricity.png'),
};



export const TaskIcon = (props) => {

  const [diameter, setDiameter] = useState({width: new Animated.Value(props.size/20)});
  const [opacity, setOpacity] = useState({opacity: new Animated.Value(1)});

  const toggleBeacon = useRef(
    Animated.loop(
      Animated.parallel([
        Animated.timing(diameter.width, {
          toValue: props.size*3,
          duration: 1000,
          useNativeDriver: false,
          easing: Easing.inOut(Easing.sin),
        }),
        Animated.timing(opacity.opacity, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: false,
          easing: Easing.inOut(Easing.sin),
        })
      ])
    )
  ).current

  if(props.name === 'o2') {
    if(props.complete === false) {
      toggleBeacon.start();
    }
    else {
      toggleBeacon.stop();
    }
    return (
      <View style={styles.container}>
        <Animated.View style={[styles.light, {width: diameter.width}, {opacity: opacity.opacity}]}>
        </Animated.View>
        <Image
              style={[
                styles.image,
                {
                  backgroundColor: props.complete ? '#ffdb12' : '#c71e08',
                  width: props.size,
                  height: props.size,
                  borderWidth: props.size/20,
                },
              ]}
              source={images[props.name || 0]}
        />
      </View>     
    );
  }
  else{ 
    return (
      <Image
        style={[
          styles.image,
          {
            backgroundColor: props.complete ? '#35e82e' : '#b5b5b5',
            width: props.size,
            height: props.size,
            borderWidth: props.size / 20,
          },
        ]}
        source={images[props.name || 0]}
      />
    );
  }
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 200,
    aspectRatio: 1,
  },
  image: {
    borderRadius: 9999,
    borderColor: '#000',
    borderWidth: 3,
  },
  light: {
    backgroundColor: 'red',
    borderRadius: 100,
    aspectRatio: 1,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
