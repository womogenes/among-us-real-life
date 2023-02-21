import { useState } from 'react';
import { Image, Pressable, StyleSheet, Button, Text, View } from 'react-native';

function LobbyScreen({ navigation }) {
    const [eventLog, updateEventLog] = useState([]);
    
    return (
        <View style={styles.lobbyContainer}>
            <View style={styles.settingsContainer}>
                <Pressable
                    accessibilityRole="button"
                    onPress={() => {
                        console.log("pressed!");
                    }}
                >
                    <Image style={styles.settingsIcon} source={require("client/assets/settingsIcon.png")}/>
                </Pressable>

                <Text style={styles.codeText}>Code: XXXXXX</Text>  
            </View>
            <View style={styles.bodyContainer}>
                <Text>Lobby Screen</Text>
                <Button
                    title="Go to Test Screen"
                    onPress={() => {
                        navigation.push("TestScreen", {
                            msg: "You came from the Lobby Screen!",
                        });
                    }}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    lobbyContainer: {
      flex: 1,
      backgroundColor: '#ffffff',
      flexDirection: 'column',
    },
    settingsContainer: {
        flexDirection: 'row',
        backgroundColor: 'powderblue',
        flex: .1,
    },
    settingsIcon: {
        justifyContent: 'flex-start',
        height: 70,
        width: 70,
    },
    codeText: {
        justifyContent: 'flex-end',
    },
    bodyContainer: {
        flex: .9,
    }
  });

export { LobbyScreen };