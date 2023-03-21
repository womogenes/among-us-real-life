import { StyleSheet, View, Animated, Button } from 'react-native';
import { useEffect, useState } from 'react';
import Easing from 'react-native/Libraries/Animated/Easing';

function TaskBar(props) {
  const [completion, setCompletion] = useState({
    width: new Animated.Value(0),
  });
  function toggleWidth() {
    Animated.timing(completion.width, {
      toValue: props.taskCompletion,
      duration: 1000,
      useNativeDriver: false,
      easing: Easing.linear,
    }).start();
  }

  useEffect(() => {
    toggleWidth();
  }, [props.taskCompletion]); // Detects whenever width changes from prop passed down from Game.js

  return (
    <View style={styles.taskbarOutside}>
      <View style={styles.taskbarInside}>
        <Animated.View
          style={[
            styles.taskbarGreen,
            {
              width: completion.width.interpolate({
                inputRange: [0, 100],
                outputRange: ['0%', '100%'],
              }),
            },
          ]}
        ></Animated.View>
      </View>
    </View>
  );
}

export default TaskBar;

const styles = StyleSheet.create({
  taskbarOutside: {
    width: '80%',
    height: 30,
    backgroundColor: '#9c9c9c',
    justifyContent: 'center',
    position: 'absolute',
    alignItems: 'center',
    padding: 5,
    bottom: 70,
  },
  taskbarInside: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#3b5735',
    alignItems: 'flex-start',
  },
  taskbarGreen: {
    flex: 1,
    height: '100%',
    backgroundColor: '#25c900',
  },
});
