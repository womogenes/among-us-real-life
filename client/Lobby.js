import { StyleSheet, Button, Text, View } from 'react-native';

function LobbyScreen({ navigation }) {
  return (
    <View style={styles.lobbyContainer}>
      <Text>Lobby Screen</Text>
      <Button
        title="Go to Test Screen"
        onPress={() => {
          navigation.push('TestScreen', {
            msg: 'You came from the Lobby Screen!',
          });
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  lobbyContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export { LobbyScreen };
