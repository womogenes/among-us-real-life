import { StyleSheet, Text, View } from 'react-native';

function LobbyScreen() {
    return (
        <View style={styles.lobbyContainer}>
            <Text>Lobby Screen</Text>
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