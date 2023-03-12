import { StyleSheet, View, Animated, TouchableOpacity, Text} from 'react-native';
import Modal from 'react-native-modal';
import { useEffect, useState } from 'react';
import Easing from 'react-native/Libraries/Animated/Easing';

function Tasks(props) {
    const [position, setPosition] = useState(new Animated.Value(-168));
    function toggleX() {
        
        if (position.__getValue() == -168){
            Animated.timing(position, {
                toValue: 0,
                duration: 300,
                useNativeDriver: false,
                easing: Easing.linear,
            }).start();
        }
        if (position.__getValue() == 0) {
            Animated.timing(position, {
                toValue: -168,
                duration: 300,
                useNativeDriver: false,
                easing: Easing.linear,
            }).start();
        }
    }

    return (
        <Animated.View
        style={[
            styles.tasks,
            {left: position.interpolate({
            inputRange: [0, 100],
            outputRange: [0, 100],
        })}]}>
            <TouchableOpacity
                style={styles.taskButton}
                onPress={() => toggleX()}
            >
                <Text style={styles.taskButtonText}>Tasks</Text>
            </TouchableOpacity>
        </Animated.View>
    );
}

export default Tasks

const styles = StyleSheet.create({
    tasks: {
        width: 200,
        height: 120,
        bottom: 120,
        backgroundColor: "rgba(100, 100, 100, 0.41)",
        justifyContent: 'center',
        position: 'absolute',
        alignItems: 'center',
        padding: 5,
    },
    taskButton: {
        right: -83,
        width: '63%',
        transform: [{rotate: '270deg'}],
        alignItem: 'center',
        backgroundColor: 'rgba(rgba(215, 215, 215, 0.41))',
        padding: 5,
    },
    taskButtonText: {
        fontWeight: '700',
        fontSize: 20,
        textAlign: 'center',
    }
}) 