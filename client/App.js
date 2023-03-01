import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { serverAddr, subscribeToMessages, getLobby } from './networking.js';
import { LobbyScreen } from './Lobby.js';
import { GameScreen } from './screens/Game.js';
import { TestScreen } from './screens/Test.js';
import { MenuScreen } from './screens/Menu.js';

const Stack = createNativeStackNavigator();

export default function App() {
  const [message, setMessage] = useState('Server connection test');

  useEffect(() => {
    subscribeToMessages(setMessage);
  }, []);

  return (
    <NavigationContainer>
      {
        <Stack.Navigator initialRouteName="TestScreen">
          <Stack.Screen name="Lobby" component={LobbyScreen} />
          <Stack.Screen name="Game" component={GameScreen} />
          <Stack.Screen
            name="TestScreen"
            component={TestScreen}
            options={{ title: 'Dev things' }}
            initialParams={{ msg: 'You came from nowhere!' }}
          />
          <Stack.Screen name="Menu" component={MenuScreen} />
          {/* William's server ping stuff */}
          {/* <View style={styles.container}>
          <Text style={{ fontSize: 18, marginBottom: 8 }}>
            Connected to <Text style={{ fontWeight: 'bold' }}>{serverAddr}</Text>
          </Text>
          <Text>Ping time: {message} ms</Text>
          <StatusBar style="auto" />
        </View> */}
        </Stack.Navigator>
      }
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});