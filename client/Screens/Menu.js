import { StyleSheet, Button, Text, View, ImageBackground } from 'react-native';

function MenuScreen({ navigation }) {
  return (
    <View style={styles.menuContainer}>
      <ImageBackground
        source={require('client/assets/menuBackground.png')}
        resizeMode="cover"
        style={styles.backgroundImage}
      ></ImageBackground>
      <Text style={styles.titleText}>Among Us!!!</Text>
      <View style={styles.buttonsContainer}>
        <Button title="Join" onPress={() => navigation.navigate('Lobby')} />
        <Button title="Public" onPress={() => navigation.navigate('Lobby')} />
        <Button title="Create" onPress={() => navigation.navigate('Lobby')} />
      </View>
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
  },
  buttonsContainer: {
    color: '#505050',
  },
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
});

export { MenuScreen };
