import { StyleSheet, View, Text, TouchableOpacity, Image,} from 'react-native';

import CustomButton from '../components/button.js';

function ControlPanel(props) {
    return (
        <View style={styles.bottom}>
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
})