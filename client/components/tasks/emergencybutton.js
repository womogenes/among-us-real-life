import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, TouchableOpacity, Animated, Text } from 'react-native';
import Easing from 'react-native/Libraries/Animated/Easing';
import Modal from 'react-native-modal';
import CustomText from '../text.js';

function EmergencyButton({ active, callEmergency, emergency, closeTask}) {
  
  const [emergencyButton, setEmergencyButton] = useState([{uses: 1}]);

  useEffect(() => { // Hacky way to make sure emergency[0] doesn't cause an error
    if(emergency.length > 0){
      setEmergencyButton(emergency);
    }
  },[emergency])

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
          disabled={emergencyButton[0].uses < 1}
          style={styles.redButton}
        >
          <View style={styles.innerCircle}>
            <CustomText textSize={40}>Emergency Only!</CustomText>
          </View>
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
  redButton: {
    backgroundColor: '#a31414',
    shadowOpacity: '0.8',
    shadowRadius: 16,
    borderRadius:  100,
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerCircle: {
    width: '95%',
    height: '95%',
    borderRadius: 100,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
