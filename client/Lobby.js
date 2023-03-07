import { useState } from 'react';
import { Image, Pressable, StyleSheet, Button, Text, View } from 'react-native';
import Constants from 'expo-constants';
import Modal from 'react-native-modal';

function LobbyScreen({ navigation }) {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleModal = () => setIsModalVisible(() => !isModalVisible);

  return (
    <View style={styles.lobbyContainer}>
      <View style={styles.settingsContainer}>
        <Pressable accessibilityRole="button" onPress={handleModal}>
          <Image
            style={styles.settingsIcon}
            source={require('client/assets/settingsIcon.png')}
          />
        </Pressable>

        <Text style={styles.codeText}>Code: XXXXXX</Text>
      </View>
      <View style={styles.bodyContainer}>
        <Text>Lobby Screen</Text>
        <Button
          title="Go to Test Screen (replace with another button if needed later)"
          onPress={() => {
            navigation.push('TestScreen', {
              msg: 'You came from the Lobby Screen!',
            });
          }}
        />
      </View>
      <Modal isVisible={isModalVisible}>
        <View style={styles.settingsModal}>
          <Text>Setting1: </Text>
          <Button title="Hide modal" onPress={handleModal} />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  lobbyContainer: {
    paddingTop: Platform.OS === 'ios' ? 0 : Constants.statusBarHeight,
    flex: 1,
    backgroundColor: '#ffffff',
    flexDirection: 'column',
  },
  settingsContainer: {
    marginTop: 10,
    marginLeft: 5,
    marginRight: 5,
    flexDirection: 'row',
    // backgroundColor: 'powderblue',
    justifyContent: 'space-between',
    flex: 0.5,
  },
  settingsIcon: {
    justifyContent: 'flex-start',
    height: 50,
    width: 50,
  },
  codeText: {
    fontSize: 25,
  },
  bodyContainer: {
    padding: 15,
    flex: 0.5,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  settingsModal: {
    backgroundColor: 'powderblue',
    borderRadius: 5,
    flex: 1,
  },
});

export { LobbyScreen };
