import {
  StyleSheet,
  View,
  Animated,
  TouchableOpacity,
  Text,
  useWindowDimensions,
} from 'react-native';
import Modal from 'react-native-modal';
import { useEffect, useState } from 'react';
import Easing from 'react-native/Libraries/Animated/Easing';

function Tasks(props) {
  const { fontScale } = useWindowDimensions(); //
  const styles = myStyles(fontScale); // pass in fontScale to the StyleSheet
  const [position, setPosition] = useState(new Animated.Value(-175));
  const [backgroundColor, setBackgroundColor] = useState(
    'rgba(100, 100, 100, 0)'
  );

  function toggleX() {
    if (position.__getValue() == -175) {
      setBackgroundColor('rgba(100, 100, 100, 0.41)');
      Animated.timing(position, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
        easing: Easing.linear,
      }).start();
    }
    if (position.__getValue() == 0) {
      Animated.timing(position, {
        toValue: -175,
        duration: 300,
        useNativeDriver: false,
        easing: Easing.linear,
      }).start(() => setBackgroundColor('rgba(100, 100, 100, 0)'));
    }
  }

  return (
    <Animated.View
      style={[
        styles.tasks,
        {
          left: position.interpolate({
            inputRange: [0, 100],
            outputRange: [0, 100],
          }),
        },
        { backgroundColor: backgroundColor },
      ]}
    >
      <View style={styles.taskList}></View>
      <View style={styles.taskButtonContainer}>
        <TouchableOpacity style={styles.taskButton} onPress={() => toggleX()}>
          <Text style={styles.taskButtonText}>Tasks</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

export default Tasks;

const myStyles = (fontScale) =>
  StyleSheet.create({
    tasks: {
      width: 200,
      height: 120,
      bottom: 120,
      flexDirection: 'row',
      justifyContent: 'flex-end',
      position: 'absolute',
      alignItems: 'stretch',
    },
    taskList: {
      flex: 1,
    },
    taskButtonContainer: {
      width: 25,
      height: 120,
      justifyContent: 'center',
      backgroundColor: 'rgba(rgba(215, 215, 215, 0.41))',
      padding: 5,
    },
    taskButton: {
      width: 120,
      height: 25,
      right: 50,
      transform: [{ rotate: '270deg' }],
    },
    taskButtonText: {
      flex: 1,
      color: 'black',
      fontSize: 20 / fontScale,
      textAlign: 'center',
      fontFamily: 'Impostograph-Regular',
      textShadowColor: '#000000',
      textShadowRadius: 3,
    },
  });
