import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { serverAddr, getLobby } from './networking.js';
import { LobbyScreen } from './screens/Lobby.js';
import { GameScreen } from './screens/Game.js';
import { TestScreen } from './screens/Test.js';
import { MenuScreen } from './screens/Menu.js';
import { JoinScreen } from './screens/Join.js';

const Stack = createNativeStackNavigator();

export default function App() {
  const [message, setMessage] = useState('Server connection test');

  return (
    <NavigationContainer>
      {
        <Stack.Navigator
          initialRouteName="MenuScreen"
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="Menu" component={MenuScreen} />
          <Stack.Screen name="Lobby" component={LobbyScreen} />
          <Stack.Screen name="Game" component={GameScreen} />
          <Stack.Screen name="Join" component={JoinScreen} />
          <Stack.Screen
            name="TestScreen"
            component={TestScreen}
            options={{ title: 'Dev things' }}
            initialParams={{ msg: 'You came from nowhere!' }}
          />

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
