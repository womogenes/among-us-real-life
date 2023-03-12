import { StyleSheet, View, Text, TouchableOpacity, Image,} from 'react-native';

import CustomButton from '../components/button.js';

function ControlPanel(props) {
    return (
        <View style={styles.bottom}>
            <CustomButton
            style={styles.usebutton}
            type={'image'}
            image={require('client/assets/usebutton.png')}
            imagesize={'75%'}
            roundness={50}
            backgroundcolor={'#00000000'}
            width={150}
            height={150}
            left={100}
            top={-75}
            />
        </View>
    );
}

export default ControlPanel

const styles = StyleSheet.create({
    bottom: {
        width: '100%',
        height: '40%',
        backgroundColor: '#EE5407',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 0,
    },
})