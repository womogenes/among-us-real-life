import { StatusBar } from 'expo-status-bar';
import React, { useRef, useEffect } from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, SafeAreaView } from 'react-native';
import Modal from 'react-native-modal';
import CustomText from '../text.js';


function CodeTask({ active, complete, closeTask }) {


  return (
    <Modal isVisible={active}>
        <View style={styles.modal}>
            <View style={styles.inputContainer}>
                <CustomText 
                    numberOfLines={1}
                    textSize={60}
                    letterSpacing={1}
                    textColor={'red'}
                    flex={1}
                >
                    ####
                </CustomText>
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button}>
                    <CustomText
                        textSize={60}
                    >
                        1
                    </CustomText>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button}>
                    <CustomText
                        textSize={60}
                    >
                        2
                    </CustomText>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button}>
                    <CustomText
                        textSize={60}
                    >
                        3
                    </CustomText>
                </TouchableOpacity>
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button}>
                    <CustomText
                        textSize={60}
                    >
                        4
                    </CustomText>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button}>
                    <CustomText
                        textSize={60}
                    >
                        5
                    </CustomText>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button}>
                    <CustomText
                        textSize={60}
                    >
                        6
                    </CustomText>
                </TouchableOpacity>
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button}>
                    <CustomText
                        textSize={60}
                    >
                        7
                    </CustomText>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button}>
                    <CustomText
                        textSize={60}
                    >
                        8
                    </CustomText>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button}>
                    <CustomText
                        textSize={60}
                    >
                        9
                    </CustomText>
                </TouchableOpacity>
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button}>
                    <CustomText
                        textSize={60}
                    >
                        ×
                    </CustomText>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button}>
                    <CustomText
                        textSize={60}
                    >
                        0
                    </CustomText>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button}>
                    <CustomText
                        textSize={60}
                    >
                        ○
                    </CustomText>
                </TouchableOpacity>
            </View>
        </View>
    </Modal>
  );
}

export default CodeTask;

const styles = StyleSheet.create({
    modal: {
        margin: 20,
        borderRadius: 20,
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        color: '#000',
      },
    inputContainer: {
        marginTop: 20,
        width: '80%',
        height: 80,
        borderWidth: 5,
        borderColor: 'black',
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        width: '100%',
        height: 100,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 5,
    },
    button: {
        flex: 1,
        borderWidth: 5,
        borderRadius: 20,
        margin: 2,
        alignItems: 'center',
        justifyContent: 'center',
    }
});
