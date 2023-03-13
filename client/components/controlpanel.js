import { StyleSheet, View, Text} from 'react-native';

import { useRef, useEffect, useState } from 'react';

import CustomButton from '../components/button.js';
import TaskBar from '../components/taskbar.js';
import Tasks from '../components/tasks.js';

function ControlPanel(props) {

    const [timer, setTimer] = useState(null);
    const [intervalID, setIntervalID] = useState();

    function killCooldown() {
        setTimer(props.cooldown)
        const interval = setInterval(() => {
            setTimer((prevState)=> (prevState - 1));
          }, 1000);
        setIntervalID(interval)
    }

    useEffect(() => {
        if(timer <= 0) {
            clearInterval(intervalID);
            setTimer(null);
        }
    }, [timer])

    return (
        <View style={styles.bottom}>
            {props.userType == "crewmate"&&
                <View style={styles.buttonContainer}>
                    <CustomButton
                    type={'image'}
                    disabled={props.useButtonState}
                    onPress={props.useButtonPress}
                    image={require('client/assets/usebutton.png')}
                    imagesize={'75%'}
                    roundness={50}
                    backgroundcolor={'#00000000'}
                    width={150}
                    height={150}
                    right={-10}
                    bottom={200}
                    />
                    <CustomButton
                    type={'image'}
                    disabled={props.reportButtonState}
                    onPress={props.reportButtonPress}
                    image={require('client/assets/reportbutton.png')}
                    imagesize={"75%"}
                    roundness={50}
                    backgroundcolor={'#00000000'}
                    width={150}
                    height={150}
                    right={-10}
                    bottom={320}
                    />
                </View>
            }
            {props.userType == "imposter"&&
                <View style={styles.buttonContainer}>
                    <CustomButton
                    type={'cooldown'}
                    disabled={props.killButtonState}
                    onPress={() => {props.killButtonPress(); killCooldown();}}
                    cooldownTimer={timer}
                    text={timer}
                    image={require('client/assets/killbutton.png')}
                    imagesize={'65%'}
                    roundness={50}
                    backgroundcolor={'#00000000'}
                    width={150}
                    height={150}
                    right={-10}
                    bottom={200}
                    />
                    <CustomButton
                    type={'image'}
                    disabled={props.reportButtonState}
                    onPress={props.reportButtonPress}
                    image={require('client/assets/reportbutton.png')}
                    imagesize={"75%"}
                    roundness={50}
                    backgroundcolor={'#00000000'}
                    width={150}
                    height={150}
                    right={-10}
                    bottom={320}
                    />
                </View>
            }
            {props.userType == "ghost-crewmate"&&
                <View style={styles.buttonContainer}>

                </View>
            }
            {props.userType == "ghost-imposter"&&
                <View style={styles.buttonContainer}>

                </View>
            }
            <Tasks/>
            <TaskBar taskCompletion={props.taskCompletion}/>
        </View>
    );
}

export default ControlPanel

const styles = StyleSheet.create({
    bottom: {
        width: '100%',
        height: '40%',
        backgroundColor: '#00000000',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 0,
    },
    buttonContainer: {
        flex: 1,
        width: '100%',
        height: '100%',
        position: 'absolute',
    }
})