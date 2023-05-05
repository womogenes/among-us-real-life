import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';

function CustomText(props) {
  const inheritedStyles = props.style || [];

  return (
    <View
      style={[
        styles.button,
        props.top && { top: props.top },
        props.bottom && { bottom: props.bottom },
        props.right && { right: props.right },
        props.left && { left: props.left },
        props.flex && { flex: props.flex },
      ]}
    >
      <Text
        style={[
          ...inheritedStyles,
          styles.textDefault,
          props.textSize ? { fontSize: props.textSize } : { fontSize: 12 },
          props.centerText ? { textAlign: 'center' } : {},
          props.textColor ? { color: props.textColor } : { color: 'black' },
          props.letterSpacing
            ? { letterSpacing: props.letterSpacing }
            : { letterSpacing: 0 },
          props.marginHorizontal
            ? { marginHorizontal: props.marginHorizontal }
            : { marginHorizontal: 0 },
          props.marginVertical
            ? { marginVertical: props.marginVertical }
            : { marginVertical: 0 },
          props.padding ? { padding: props.padding } : { padding: 0 },
          props.borderWidth
            ? { borderWidth: props.borderWidth }
            : { borderWidth: 0 },
          props.borderRadius
            ? { borderRadius: props.borderRadius }
            : { borderRadius: 0 },
          props.backgroundColor
            ? { backgroundColor: props.backgroundColor }
            : {},
          props.overflow ? { overflow: props.overflow } : {},
          props.shadowColor ? { textShadowColor: props.shadowColor } : {},
          props.shadowRadius ? { textShadowRadius: props.shadowRadius } : {},
        ]}
      >
        {props.children}
      </Text>
    </View>
  );
}
export default CustomText;

const styles = StyleSheet.create({
  textDefault: {
    fontFamily: 'Impostograph-Regular',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
