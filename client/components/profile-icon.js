import { StyleSheet, View, Image } from 'react-native';

export const ProfileIcon = ({ player }) => {
  if (!player) return;

  const images = {
    red: require('../assets/profile-icons/red.png'),
    blue: require('../assets/profile-icons/blue.png'),
    green: require('../assets/profile-icons/green.png'),
    white: require('../assets/profile-icons/white.png'),
  };
  const { icon } = player;

  return <Image style={styles.image} source={images[icon]} />;
};

const styles = StyleSheet.create({
  image: {
    width: 40,
    height: 40,
    borderRadius: 9999,
    borderColor: '#000',
    borderWidth: 3,
  },
});
