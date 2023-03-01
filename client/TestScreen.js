import { StyleSheet, Button, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

function TestScreen({ route, navigation }) {
    const { msg } = route.params;
    return (
        <View style={styles.testContainer}>
            <Text>Test Screen</Text>
            <Text>{JSON.stringify(msg)}</Text>
            <Button
                title="Go to Lobby Screen"
                onPress={() => navigation.navigate("Lobby")}
            />
            <Button
                title="Go to Game Screen"
                onPress={() => navigation.navigate("Game")}
            />
            <Button
                title="Go to Test Screen (this) again!"
                onPress={() => {
                    navigation.push("TestScreen", {
                        msg: "You came from the Test Screen!",
                    });
                }}
            />
            <Button
                title="Go Back"
                onPress={() => navigation.goBack()}
            />
            <Button
                title="Go back to first screen in stack"
                onPress={() => navigation.popToTop()}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    testContainer: {
      flex: 1,
      backgroundColor: '#ffffff',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

export { TestScreen };