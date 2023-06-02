import { StyleSheet, View, Image } from 'react-native';

import { useEffect, useState } from 'react';

import { getGameRoom } from '../networking';

const images = {
  banana: require('../assets/profile-icons/banana.png'),
  black: require('../assets/profile-icons/black.png'),
  blue: require('../assets/profile-icons/blue.png'),
  brown: require('../assets/profile-icons/brown.png'),
  coral: require('../assets/profile-icons/coral.png'),
  cyan: require('../assets/profile-icons/cyan.png'),
  gray: require('../assets/profile-icons/gray.png'),
  green: require('../assets/profile-icons/green.png'),
  lime: require('../assets/profile-icons/lime.png'),
  maroon: require('../assets/profile-icons/maroon.png'),
  orange: require('../assets/profile-icons/orange.png'),
  pink: require('../assets/profile-icons/pink.png'),
  purple: require('../assets/profile-icons/purple.png'),
  red: require('../assets/profile-icons/red.png'),
  rose: require('../assets/profile-icons/rose.png'),
  tan: require('../assets/profile-icons/tan.png'),
  white: require('../assets/profile-icons/white.png'),
  yellow: require('../assets/profile-icons/yellow.png'),
};

export const ProfileIcon = ({ player, size, style, direction, active, sabotage, isImpostor, myId }) => {
  if (!player) return;

  const { icon } = player;

  return (
    <View style={[styles.container, myId && player.sessionId === myId? {backgroundColor: '#ffd666'} : isImpostor? player?.isImpostor? {backgroundColor: 'red'} : {backgroundColor: 'white'} : {backgroundColor: 'white'}]}>
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
      {active && (
        <View
          style={[
            styles.arrow,
            {
              transform: [{ rotateZ: parseFloat(direction + Math.PI) + 'rad' }],
            },
          ]}
        >
          <View style={[styles.triangle, (sabotage? {borderBottomColor: '#f70000'} : {borderBottomColor: '#fcfa65'})]}></View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
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
    position: 'absolute',
  },
  triangle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 15,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    position: 'absolute',
  },
});
