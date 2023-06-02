import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Asset } from 'expo-asset';

import { serverAddr, getLobby } from './networking.js';
import { LobbyScreen } from './screens/Lobby.js';
import { GameScreen } from './screens/Game.js';
import { TestScreen } from './screens/Test.js';
import { MenuScreen } from './screens/Menu.js';
import { JoinScreen } from './screens/Join.js';
import { useFonts } from 'expo-font';
import { AppLoading } from 'expo';

const Stack = createNativeStackNavigator();

export default function App() {
  const [message, setMessage] = useState('Server connection test');

  const [fontsLoaded] = useFonts({
    'Impostograph-Regular': require('client/assets/Impostograph-Regular.ttf'),
  });

  function cacheImages(images) {
    return images.map((image) => {
      if (typeof image === 'string') {
        return Image.prefetch(image);
      } else {
        return Asset.fromModule(image).downloadAsync();
      }
    });
  }

  // Load any resources or data that you need prior to rendering the app
  useEffect(() => {
    async function loadResourcesAndDataAsync() {
      const imageAssets = cacheImages([
        require('./assets/profile-icons/banana.png'),
        require('./assets/profile-icons/black.png'),
        require('./assets/profile-icons/blue.png'),
        require('./assets/profile-icons/brown.png'),
        require('./assets/profile-icons/coral.png'),
        require('./assets/profile-icons/cyan.png'),
        require('./assets/profile-icons/gray.png'),
        require('./assets/profile-icons/green.png'),
        require('./assets/profile-icons/lime.png'),
        require('./assets/profile-icons/maroon.png'),
        require('./assets/profile-icons/orange.png'),
        require('./assets/profile-icons/pink.png'),
        require('./assets/profile-icons/purple.png'),
        require('./assets/profile-icons/red.png'),
        require('./assets/profile-icons/rose.png'),
        require('./assets/profile-icons/tan.png'),
        require('./assets/profile-icons/white.png'),
        require('./assets/profile-icons/yellow.png'),
        require('./assets/adaptive-icon.png'),
        require('./assets/dimmer.png'),
        require('./assets/electricitySlider.png'),
        require('./assets/favicon.png'),
        require('./assets/fingerprint.png'),
        require('./assets/icon.png'),
        require('./assets/killbutton.png'),
        require('./assets/menuBackground.png'),
        require('./assets/menuIgnore.png'),
        require('./assets/reportbutton.png'),
        require('./assets/reporticon.png'),
        require('./assets/sabotagebutton.png'),
        require('./assets/settings.png'),
        require('./assets/settingsIcon.png'),
        require('./assets/splash.png'),
        require('./assets/usebutton.png'),
        require('./assets/x.png'),
        require('./assets/task-icons/calibrate.png'),
        require('./assets/task-icons/electricity.png'),
        require('./assets/task-icons/emergency.png'),
        require('./assets/task-icons/memory.png'),
        require('./assets/task-icons/passcode.png'),
        require('./assets/task-icons/recaptcha.png'),
        require('./assets/task-icons/scanner.png'),
      ]);

      await Promise.all([...imageAssets]);
      Alert.alert('Images are cached!');
    }

    loadResourcesAndDataAsync();
  }, []);

  if (fontsLoaded) {
    console.log('fonts loaded');
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
            <Stack.Screen
              name="Lobby"
              component={LobbyScreen}
              options={{ gestureEnabled: false }}
            />
            <Stack.Screen
              name="Game"
              component={GameScreen}
              options={{ gestureEnabled: false }}
            />
            <Stack.Screen name="Join" component={JoinScreen} />

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
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
