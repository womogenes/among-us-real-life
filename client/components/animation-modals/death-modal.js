import { StyleSheet, View, Modal, TouchableOpacity, Text } from 'react-native';
import { ProfileIcon } from '../profile-icon';
import CustomText from '../text';
import { useState, useEffect } from 'react';
import { AnimationModal } from './animation-modal.js';

export const DeathModal = (props) => {

  return (
    <AnimationModal isVisible={props.isVisible} onClose={props.onClose}>
      <View style={styles.container}>
        <CustomText textSize={100} textAlign={'center'} textColor={'red'}>
          <Text>You Died!</Text>
        </CustomText>
        <View style={styles.glow}>
          <ProfileIcon player={props.killer} size={200} isImpostor={true}/>
        </View>
        <CustomText textSize={30} textAlign={'center'} textColor={'white'}>
          <Text>{props.killer?.username}</Text>
        </CustomText>
      </View>
    </AnimationModal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000',
    borderRadius: 15,
  },
  glow: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'red',
    shadowOpacity: 1,
    shadowRadius: 100,
  },
});
