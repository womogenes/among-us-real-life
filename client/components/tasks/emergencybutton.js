import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, TouchableOpacity, Animated, Text } from 'react-native';
import Easing from 'react-native/Libraries/Animated/Easing';
import Modal from 'react-native-modal';
import CustomText from '../text.js';

function EmergencyButton({ active, callEmergency, closeTask}) {
  
  return (
    <Modal isVisible={active}>
      <View style={styles.modal}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => [closeTask()]}
        >
          <CustomText textSize={30}>&#10006;</CustomText>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => [callEmergency(), closeTask()]}
        >
          <CustomText textSize={30}>Press Here</CustomText>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

export default EmergencyButton;

const styles = StyleSheet.create({
  modal: {
    margin: 20,
    marginTop: 100,
    marginBottom: 100,
    borderRadius: 20,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    color: '#000',
    padding: 20,
  },
  closeButton: {
    position: 'absolute',
    right: 0,
    top: 0,
    margin: 10,
  },
});
