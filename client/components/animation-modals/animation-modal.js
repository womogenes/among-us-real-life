import {
  StyleSheet,
  View,
  Button,
  Modal,
  TouchableOpacity,
} from 'react-native';
import Constants from 'expo-constants';
import CustomText from '../text';
import { useState, useEffect } from 'react';

export const AnimationModal = (props) => {
  /*
    props:
      children:  content (React thing for content)
      onClose:   function (gets called when x button is pressed)
      isVisible: boolean  (React state for whether modal is visible)
  */

  return (
    <Modal animationType="slide" transparent={true} visible={props.isVisible}>
      <View style={styles.modal}>
        <View
          style={[
            props.width ? { width: props.width } : { width: '80%' },
            props.height ? { height: props.height } : { height: '50%' },
          ]}
        >
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => {
              if (props.onClose) props.onClose();
            }}
          >
            <CustomText textSize={30}>&#10006;</CustomText>
          </TouchableOpacity>

          {props.children}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00000080',
  },
  closeButton: {
    position: 'absolute',
    right: 5,
    top: 0,
    margin: 10,
    zIndex: 1,
  },
});
