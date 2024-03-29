import {
  StyleSheet,
  View,
  Animated,
  TouchableOpacity,
  Text,
  useWindowDimensions,
  Button,
} from 'react-native';
import Modal from 'react-native-modal';
import { useEffect, useState } from 'react';
import Easing from 'react-native/Libraries/Animated/Easing';
import CustomText from './text.js';

function TaskMenu(props) {
  const { fontScale } = useWindowDimensions(); //
  const styles = myStyles(fontScale); // pass in fontScale to the StyleSheet
  const [position, setPosition] = useState(new Animated.Value(-175));
  const [backgroundColor, setBackgroundColor] = useState(
    'rgba(100, 100, 100, 0)'
  );

  function tasks() {
    let counter = 0;
    return props.tasks.map((task) => {
      counter++;
      return (
        <CustomText
          style={[styles.listText]}
          textSize={14}
          key={task.taskId}
          textColor={task.complete ? '#AAFF00' : '#F7B500'}
        >
          {counter}.{' '}
          {/* {`${task.name} (${task.taskId.substring(0, 4).replace('_', '-')})${
            task.complete ? ' (Complete)' : ''
          }`} */}
          {`${task.name} ${task.complete ? ' (Complete)' : ''}`}
        </CustomText>
      );
    });
  }

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
      <View style={styles.taskList}>{tasks()}</View>
      <View style={styles.taskButtonContainer}>
        <TouchableOpacity style={styles.taskButton} onPress={() => toggleX()}>
          <Text style={styles.taskButtonText}>Tasks</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

export default TaskMenu;

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
      padding: 5,
      backgroundColor: 'rgba(194, 194, 194, 0.6)',
    },
    taskButtonContainer: {
      width: 25,
      height: 120,
      justifyContent: 'center',
      backgroundColor: 'rgba(215, 215, 215, 0.8)',
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
    listText: {
      fontWeight: 'bold',
      textShadowColor: '#000000',
      textShadowRadius: 3,
    },
  });
