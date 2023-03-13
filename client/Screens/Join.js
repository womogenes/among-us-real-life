import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  FlatList,
  SafeAreaView,
} from 'react-native';
import React, { useState } from 'react';

function JoinScreen({ navigation }) {
  const [code, onChangeCode] = useState('');
  const rooms = [
    {
      id: '0000',
      title: 'First Room',
    },
    {
      id: '0001',
      title: 'Second Room',
    },
    {
      id: '0002',
      title: 'Third Room',
    },
    {
      id: '1',
      title: 'First Room',
    },
    {
      id: '2',
      title: 'Second Room',
    },
    {
      id: '3',
      title: 'Third Room',
    },
    {
      id: '4',
      title: 'First Room',
    },
    {
      id: '5',
      title: 'Second Room',
    },
    {
      id: '6',
      title: 'Third Room',
    },
    {
      id: '7',
      title: 'First Room',
    },
    {
      id: '8',
      title: 'Second Room',
    },
    {
      id: '9',
      title: 'Third Room',
    },
  ];

  function joinPressed(code) {
    if (code == '5050') {
      navigation.navigate('Lobby');
    }
  }
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
        style={styles.menuContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        enabled={false}
      >
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>Join Server</Text>
        </View>
        <View style={styles.bodyContainer}>
          <TextInput
            style={styles.textInput}
            onChangeText={onChangeCode}
            placeholder="XXXX"
            autoCapitalize="characters"
            autoComplete="off"
            autoCorrect={false}
            keyboardType="numeric"
            maxLength={4}
            textAlign={'center'}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              joinPressed(code);
            }}
          >
            <Text style={styles.touchableButton}>Join</Text>
          </TouchableOpacity>
        </View>
        <SafeAreaView style={styles.roomListContainer}>
          <FlatList
            style={styles.roomList}
            data={rooms}
            renderItem={({ item }) => (
              <Text style={styles.room}>{item.title}</Text>
            )}
            keyExtractor={(item) => item.id}
            snapToAlignment="start"
            decelerationRate={'fast'}
          />
        </SafeAreaView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  menuContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
  },
  titleContainer: {
    flex: 0.2,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  titleText: {
    fontWeight: 'bold',
    color: 'black',
    fontSize: 50,
    letterSpacing: 1,
  },
  bodyContainer: {
    flex: 0.3,
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#BDC9C9',
    width: '30%',
    height: '25%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  touchableButton: {
    color: 'black',
    fontSize: 20,
  },
  textInput: {
    width: '40%',
    height: '25%',
    borderWidth: 1,
    fontSize: 25,
  },
  roomListContainer: {
    flex: 0.5,
    alignItems: 'center',
  },
  roomList: {
    width: '80%',
    borderRadius: 5,
    borderWidth: 1,
    backgroundColor: '#BDC9C9',
  },
  room: {
    backgroundColor: '#ffffff',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'black',
    fontSize: 20,
    padding: 10,
    margin: 2,
  },
});

export { JoinScreen };
