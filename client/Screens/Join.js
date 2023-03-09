import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import React, { useState } from 'react';

function JoinScreen({ navigation }) {
  const [code, onChangeCode] = useState('');

  return (
    <View style={styles.menuContainer}>
      <View style={{ flex: 1, backgroundColor: 'transparent' }} />
      <Text style={styles.titleText}>Join Server</Text>
      <View style={styles.emptyContainer}></View>
      <TextInput
        style={styles.textInput}
        onChangeText={onChangeCode}
        placeholder="XXXXXXXXX"
        autoCapitalize="characters"
        autoComplete="off"
        autoCorrect="off"
        keyboardType="numeric"
        maxLength={4}
        color="#333"
        placeholderTextColor={'black'}
      ></TextInput>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Lobby')}
      >
        <Text style={styles.touchableButton}>Join</Text>
      </TouchableOpacity>
      <View style={styles.emptyTouchableView}></View>
    </View>
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
    flex: 2,
  },
  touchableButton: {
    color: 'black',
    fontSize: 17,
  },
  textInput: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 30,
    fontSize: 25,
    marginBottom: '10%',
    color: 'black',
  },
  emptyContainer: {
    flex: 0.5,
  },
});

export { JoinScreen };
