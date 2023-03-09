import { StyleSheet, View, Text, TouchableOpacity, Image,} from 'react-native';

function CustomButton(props) {
    return (
        <View style={styles.button}>
            <TouchableOpacity style={[
                styles.shape,
                props.roundness? {borderRadius: props.roundness} : {borderRadius: 1},
                props.backgroundcolor? {backgroundColor: props.backgroundcolor} : {backgroundColor: 'white'},
                props.width? {width: props.width} : {width: 100},
                props.height? {height: props.height} : {height: 100},
                ]}>
                {props.type == 'image'? 
                    <Image style={[styles.buttonImage, props.imagesize? {width: props.imagesize} : {width: '100%'}]} source={props.image} /* prop example: require('client/assets/myimage.jpg') *//>
                : props.type == 'text'? <Text style={styles.buttonText}>{props.text}</Text>
                :
                [
                    
                    <Image style={[styles.buttonImage, props.imagesize? {width: props.imagesize} : {width: '100%'}]} source={props.image}/>,
                    <Text style={styles.buttonText}>{props.text}</Text>
                ]
                }
            </TouchableOpacity>
        </View>
    );
}

export default CustomButton

const styles = StyleSheet.create({
    button: {
        justifyContent: 'center',
        flex: 1,
        display: 'flex',
        alignItems: 'center',
    },
    shape: {
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonImage:  {
        margin: 10,
        resizeMode: 'cover',
        flex: 1,
    },
    buttonText: {
        color: 'black',
    },
})