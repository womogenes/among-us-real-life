import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { serverAddr, subscribeToMessages, getLobby } from './networking.js';

export default function App() {
  const [message, setMessage] = useState('Server connection test');

  useEffect(() => {
    subscribeToMessages(setMessage);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 18, marginBottom: 8 }}>
        Connected to <Text style={{ fontWeight: 'bold' }}>{serverAddr}</Text>
      </Text>
      <Text>Ping time: {message} ms</Text>
      <StatusBar style="auto" />
    </View>
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
