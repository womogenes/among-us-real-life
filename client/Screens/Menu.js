import { StyleSheet, Button, Text, View } from 'react-native';

function MenuScreen({ navigation }) {
  return (
    <View style={styles.menuContainer}>
      <Text>Menu Screen!!!</Text>
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
});

export { MenuScreen };
