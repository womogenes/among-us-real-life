import { StyleSheet, View, Image } from 'react-native';

export const TaskIcon = (props) => {
  const images = {
    reCaptcha: require('../assets/task-icons/recaptcha.png'),
    o2: require('../assets/task-icons/passcode.png'),
    memory: require('../assets/task-icons/memory.png'),
    electricity: require('../assets/task-icons/electricity.png'),
  };

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
};

const styles = StyleSheet.create({
  image: {
    borderRadius: 9999,
    borderColor: '#000',
    borderWidth: 3,
  },
});
