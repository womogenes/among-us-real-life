import { StyleSheet, View, Image } from 'react-native';

export const ProfileIcon = ({ player, size, style }) => {
  if (!player) return;

  const images = {
    red: require('../assets/profile-icons/red.png'),
    blue: require('../assets/profile-icons/blue.png'),
    green: require('../assets/profile-icons/green.png'),
    white: require('../assets/profile-icons/white.png'),
  };
  const { icon } = player;

  return (
    <Image
      style={[
        style,
        styles.image,
        !player.isAlive ? styles.imageDead : {},
        { width: size, height: size },
      ]}
      source={images[icon]}
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
  imageDead: {
    borderColor: '#f00',
    opacity: 0.5,
  },
});
