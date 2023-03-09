import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import React, { useState } from 'react';

function JoinScreen({ navigation }) {
  const [code, onChangeCode] = useState('');
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.menuContainer}>
        <View style={{ flex: 1, backgroundColor: 'transparent' }} />
        <Text style={styles.titleText}>Join Server</Text>
        <View style={styles.emptyContainer}></View>
        <TextInput
          style={styles.textInput}
          onChangeText={onChangeCode}
          placeholder="XXXX"
          autoCapitalize="characters"
          autoComplete="off"
          autoCorrect="off"
          keyboardType="numeric"
          maxLength={4}
        ></TextInput>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Lobby')}
        >
          <Text style={styles.touchableButton}>Join</Text>
        </TouchableOpacity>
        <View style={styles.emptyTouchableView}></View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  menuContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleText: {
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
    fontSize: 50,
    flex: 0.5,
    letterSpacing: 1,
  },
  button: {
    backgroundColor: '#BDC9C9',
    paddingLeft: 40,
    paddingRight: 40,
    paddingTop: 15,
    paddingBottom: 15,
    borderRadius: 20,
  },
  emptyTouchableView: {
    flex: 4,
  },
  touchableButton: {
    color: 'black',
    fontSize: 17,
  },
  textInput: {
    height: 60,
    margin: 12,
    borderWidth: 1,
    paddingLeft: 40,
    paddingRight: 40,
    fontSize: 25,
    marginBottom: '10%',
  },
  emptyContainer: {
    flex: 0.5,
  },
});

export { JoinScreen };
