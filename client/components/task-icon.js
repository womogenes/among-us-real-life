import { StyleSheet, View, Image } from 'react-native';

<<<<<<< HEAD
const images = {
  reCaptcha: require('../assets/task-icons/recaptcha.png'),
  o2: require('../assets/task-icons/passcode.png'),
  memory: require('../assets/task-icons/memory.png'),
  electricity: require('../assets/task-icons/electricity.png'),
};

export const TaskIcon = (props) => {
  return (
    <Image
      style={[
        styles.image,
        {
          backgroundColor: props.complete ? '#35e82e' : '#Ee3a3a',
          width: props.size,
          height: props.size,
          borderWidth: props.size / 20,
        },
      ]}
      source={images[props.name || 0]}
    />
  );
=======
export const TaskIcon = (props) => {
  const images = {
    reCaptcha: require('../assets/task-icons/recaptcha.png'),
    o2: require('../assets/task-icons/passcode.png'),
    memory: require('../assets/task-icons/memory.png'),
    electricity: require('../assets/task-icons/electricity.png'),
  };
  if(props.name === 'o2') {
    return (
      <Image
        style={[
          styles.image,
          {
            backgroundColor: props.complete ? '#fff12e' : '#Ee3a3a',
            width: props.size,
            height: props.size,
            borderWidth: props.size / 20,
          },
        ]}
        source={images[props.name || 0]}
      />
    );
  }
  else{
    return (
      <Image
        style={[
          styles.image,
          {
            backgroundColor: props.complete ? '#35e82e' : '#b6b8b6',
            width: props.size,
            height: props.size,
            borderWidth: props.size / 20,
          },
        ]}
        source={images[props.name || 0]}
      />
    );
  }
>>>>>>> e05eeb3f9437f09687489abd38449796206989db
};

const styles = StyleSheet.create({
  image: {
    borderRadius: 9999,
    borderColor: '#000',
    borderWidth: 3,
  },
});
