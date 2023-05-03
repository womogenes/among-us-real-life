import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';

function ElectricityTask(props) {
  const [code, setCode] = useState(
    Array.from({ length: 3 }, () => Math.floor(Math.random() * 16))
  );

  const greenColor = '#AAFF00';
  const yellowColor = '#F7B500';
  const redColor = '#EE4B2B';

  useEffect(() => {
    if (props.active) {
    }
  }, [props.active]);

  return (
    <Modal isVisible={props.active} style={{ alignItems: 'center' }}>
      <View style={styles.modal}></View>
    </Modal>
  );
}

export default ElectricityTask;

const styles = StyleSheet.create({
  modal: {
    backgroundColor: '#d7d6d8',
    alignItems: 'center',
    height: 405,
    width: 310,
    borderRadius: 15,
  },
});
