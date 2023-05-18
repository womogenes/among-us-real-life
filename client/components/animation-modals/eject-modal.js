import { StyleSheet, View, Modal, TouchableOpacity } from 'react-native';
import { ProfileIcon } from '../profile-icon';
import CustomText from '../text';
import { useState } from 'react';
import { AnimationModal } from './animation-modal.js';

export const EjectModal = (props) => {
  /*
    props: playerId (Colyseus state object of dead player)
  */
  if (!props.player) return;

  return (
    <AnimationModal isVisible={props.isVisible} onClose={props.onClose}>
      <View style={styles.container}>
        <CustomText>Hello</CustomText>
        {/* <ProfileIcon player={props.player} /> */}
      </View>
    </AnimationModal>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
});
