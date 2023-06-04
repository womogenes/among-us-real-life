import { StyleSheet, View, Image, Text } from 'react-native';

import { useEffect, useState } from 'react';

import { getGameRoom } from '../networking';

const skins = {
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

const hats ={
  bandana: {source: require('../assets/hats/bandana.png'), size: 1.25, bottom: 10, left: 30},
  bandana2: {source: require('../assets/hats/bandana2.png'), size: 1.1, bottom: 5, left: -10},
  cap: {source: require('../assets/hats/cap.png'), size: 1.25, bottom: 3, left: -20},
  doctor: {source: require('../assets/hats/doctor.png'), size: 1.6, bottom: 3, left: 25},
  fedora: {source: require('../assets/hats/fedora.png'), size: 1, bottom: 3, left: 20},
  general: {source: require('../assets/hats/general.png'), size: 1.2, bottom: 2.2, left: 40},
  goggles: {source: require('../assets/hats/goggles.png'), size: 1.6, bottom: 3.8, left: 20},
  halo: {source: require('../assets/hats/halo.png'), size: 1.6, bottom: 2.5, left: 20},
  nest: {source: require('../assets/hats/nest.png'), size: 1.25, bottom: 2.5, left: 20},
  oldcap: {source: require('../assets/hats/oldcap.png'), size: 1.25, bottom: 3, left: 25},
  paper: {source: require('../assets/hats/paper.png'), size: 1.25, bottom: 2.1, left: 25},
  russian: {source: require('../assets/hats/russian.png'), size: 1.25, bottom: 2.9, left: 25},
  slippery: {source: require('../assets/hats/slippery.png'), size: 1.25, bottom: 2, left: 25},
  soldier: {source: require('../assets/hats/soldier.png'), size: 1.25, bottom: 5, left: 25},
  sprout: {source: require('../assets/hats/sprout.png'), size: 2, bottom: 1.9, left: -40},
  toilet: {source: require('../assets/hats/toilet.png'), size: 2, bottom: 2.2, left: -20},
};

export const ProfileIcon = ({ player, size, style, direction, active, sabotage, isImpostor, myId, renderSkin, renderHat }) => {
  
  const icon = player?.icon;
  if (!player && !renderSkin && !renderHat){
    return;
  }

  return (
    <View>
      {player? 
        <View style={[styles.container, myId && player.sessionId === myId? {backgroundColor: '#ffd666'} : isImpostor? player?.isImpostor? {backgroundColor: 'red'} : {backgroundColor: 'white'} : {backgroundColor: 'white'}]}>
          <View style={[style, styles.imageContainer, { width: size, height: size }, { zIndex: getGameRoom()?.sessionId === player.sessionId ? 9 : 1 }]}>
            <Image
              style={[
                styles.image,
                !player.isAlive ? styles.imageDead : {},
                { width: size, height: size },
              ]}
              source={skins[icon?.skin?.name]}
            />
            <View style={styles.imageBorder}>
            </View>
            {player?.icon?.hat?.name && hats[icon?.hat?.name]?
              <Image
                style={[
                  !player.isAlive ? {opacity: 0.5} : {opacity: 1},
                  {width: size/(hats[icon?.hat?.name]?.size ? hats[icon?.hat?.name]?.size : 10), height: size/(hats[icon?.hat?.name]?.size? hats[icon?.hat?.name]?.size : 10)},
                  { bottom: size/(hats[icon?.hat?.name]?.bottom? hats[icon?.hat?.name]?.bottom : 10) },
                  { left: size/(hats[icon?.hat?.name]?.left?  hats[icon?.hat?.name]?.left : 2)},
                  { right: size/(hats[icon?.hat?.name]?.right?  hats[icon?.hat?.name]?.right : 2)}
                ]}
                source={hats[icon?.hat?.name]?.source}
              />
              :
              <View>
              </View>
            }
          </View>
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
      : (renderSkin && !renderHat)?
        <View style={[styles.container, {backgroundColor: 'white'}]}>
          <View style={[style, styles.imageContainer, { width: size, height: size }]}>
            <Image
              style={[
                style,
                styles.image,
                { width: size, height: size },,
              ]}
              source={skins[renderSkin?.name]}
            />
            <View style={styles.imageBorder}>
            </View>
          </View>
        </View>
      :
      <View style={[styles.container, {backgroundColor: 'white'}]}>
        <View style={[style, styles.imageContainer, { width: size, height: size }, {overflow: 'visible'}]}>
          <Image
            style={[
              style,
              styles.image,
              { width: size/(hats[renderHat?.name]?.size? hats[renderHat?.name]?.size : 10), height: size/(hats[renderHat?.name]?.size? hats[renderHat?.name]?.size : 10) },
            ]}
            source={hats[renderHat?.name]?.source}
          />
          <View style={styles.imageBorder}>
          </View>
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
    borderRadius: 100,
  },
  imageContainer: {
    borderRadius: 9999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageBorder: {
    position: 'absolute',
    borderRadius: 9999,
    borderColor: '#000',
    borderWidth: 3,
    width: '100%',
    height: '100%',
  },
  image: {
    borderRadius: 9999,
    position: 'absolute',
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
