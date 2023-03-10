import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';

function CustomButton(props) {
  var myOpacity = 1;

  if (props.disabled || props.cooldownTimer > 0) {
    myOpacity = 0.5;
  } else {
    myOpacity = 1;
  }

  return (
    <View
      style={[
        styles.button,
        props.top && { top: props.top },
        props.bottom && { bottom: props.bottom },
        props.right && { right: props.right },
        props.left && { left: props.left },
      ]}
    >
      <TouchableOpacity
        disabled={props.cooldownTimer > 0 ? true : props.disabled}
        onPress={props.onPress}
        style={[
          styles.shape,
          props.roundness
            ? { borderRadius: props.roundness }
            : { borderRadius: 1 },
          props.backgroundcolor
            ? { backgroundColor: props.backgroundcolor }
            : { backgroundColor: 'white' },
          props.width ? { width: props.width } : { width: 100 },
          props.height ? { height: props.height } : { height: 100 },
        ]}
      >
        {props.type == 'image' ? (
          <Image
            style={[
              styles.buttonImage,
              { opacity: myOpacity },
              props.imagesize ? { width: props.imagesize } : { width: '100%' },
            ]}
            source={
              props.image
            } /* prop example: require('client/assets/myimage.jpg') */
          />
        ) : props.type == 'text' ? (
          <Text style={[styles.buttonText, { opacity: myOpacity }]}>
            {props.text}
          </Text>
        ) : props.type == 'cooldown' ? (
          [
            <Image
              style={[
                styles.buttonImage,
                { opacity: myOpacity },
                props.imagesize
                  ? { width: props.imagesize }
                  : { width: '100%' },
              ]}
              source={props.image}
            />,
            <Text style={[styles.buttonText, { opacity: 1 }]}>
              {props.text}
            </Text>,
          ]
        ) : (
          <View></View>
        )}
      </TouchableOpacity>
    </View>
  );
}

export default CustomButton;

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    position: 'absolute',
  },
  shape: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonImage: {
    margin: 10,
    resizeMode: 'contain',
    flex: 1,
  },
  buttonText: {
    color: 'black',
    position: 'absolute',
    fontSize: 40,
    fontWeight: '900',
  },
});
