import { StyleSheet, View, Image } from 'react-native';

export const ProfileIcon = (props) => {
  const images = [
    require('../assets/profile-icons/red.png'),
    require('../assets/profile-icons/blue.png'),
    require('../assets/profile-icons/green.png'),
    require('../assets/profile-icons/white.png'),
  ];

  return (
    <Image
      style={[styles.image, { width: props.size, height: props.size }]}
      source={images[props.id || 0]}
    />
  );
};

const styles = StyleSheet.create({
  image: {
    borderRadius: 9999,
    borderColor: '#000',
    borderWidth: 3,
    zIndex: 9,
  },
});
