import { StyleSheet, View, Text, TouchableOpacity, Image,} from 'react-native';

function CustomButton(props) {

    return (
        <View style={styles.button}>
            <TouchableOpacity>
                <Image style={styles.buttonImage} source={props.image}/>
                <Text style={styles.buttonText}>{props.text}</Text>
            </TouchableOpacity>
        </View>
    );
}

export default CustomButton

const styles = StyleSheet.create({
    button: {
        margin: 8,
        borderRadius: 6,
        backgroundColor: '#5e0acc',
    },
    pressedItem: {
        opacity: 0.5
    },
    buttonImage:  {
        padding: 8,
        width: 100,
        height: 100,
    },
    buttonText: {
        padding: 8,
        color: 'black',
    },
})