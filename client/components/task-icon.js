import { StyleSheet, View, Image } from 'react-native';

export const TaskIcon = (props) => {
  const images = {
    reCaptcha: require('../assets/task-icons/recaptcha.png'),
    passcode: require('../assets/task-icons/passcode.png'),
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