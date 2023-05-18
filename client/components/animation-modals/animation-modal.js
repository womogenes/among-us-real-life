import {
  StyleSheet,
  View,
  Button,
  Modal,
  TouchableOpacity,
} from 'react-native';
import Constants from 'expo-constants';
import CustomText from '../text';
import { useState } from 'react';

export const AnimationModal = (props) => {
  /*
    props:
      children (React thing for content)
  */

  return (
    <Modal animationType="fade" transparent={true} visible={props.isVisible}>
      <View style={styles.modal}>
        <View style={styles.content}>
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

  content: {
    width: '80%',
    height: '50%',
    backgroundColor: '#fff',
    borderRadius: 10,
  },
});
