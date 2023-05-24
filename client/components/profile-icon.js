import { StyleSheet, View, Image } from 'react-native';

import { useEffect, useState } from 'react';

import { getGameRoom } from '../networking';


const images = {
  red: require('../assets/profile-icons/red.png'),
  blue: require('../assets/profile-icons/blue.png'),
  green: require('../assets/profile-icons/green.png'),
  white: require('../assets/profile-icons/white.png'),
};

export const ProfileIcon = ({ player, size, style, direction, active }) => {
  if (!player) return;

  const { icon } = player;

  useEffect(() => {
    console.log(direction);
  }, [direction])

  return (
    <View style={styles.container}>
      <Image
        style={[
          style,
          styles.image,
          !player.isAlive ? styles.imageDead : {},
          { width: size, height: size },
          { zIndex: getGameRoom()?.sessionId === player.sessionId ? 9 : 1 },
        ]}
        source={images[icon]}
      />
      {active &&
        <View style={[styles.arrow, {transform: [{rotateZ: parseFloat(direction + Math.PI) + 'rad'}]}]}>
          <View style={styles.triangle}>

          </View>
        </View>
      }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 100,
  },
  image: {
    borderRadius: 9999,
    borderColor: '#000',
    borderWidth: 3,
  },
  imageDead: {
    borderColor: '#f00',
    opacity: 0.5,
  },
  arrow: {
    alignItems: 'center',
    borderRadius: 100,
    width: 100,
    height: 100,
    position:'absolute',
  },
  triangle: {
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 15,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "#fcfa65",
    position: 'absolute',
  }
});
