import { StyleSheet, View, Image } from 'react-native';

export const ProfileIcon = (props) => {
  const images = [
    require('../assets/profile-icons/red.png'),
    require('../assets/profile-icons/blue.png'),
    require('../assets/profile-icons/green.png'),
    require('../assets/profile-icons/white.png'),
  ];

  return <Image style={styles.image} source={images[props.id || 0]} />;
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
