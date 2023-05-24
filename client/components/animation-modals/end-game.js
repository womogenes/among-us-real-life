import { StyleSheet, View, Modal, TouchableOpacity, Text } from 'react-native';
import { ProfileIcon } from '../profile-icon';
import CustomText from '../text';
import { useState, useEffect } from 'react';
import { AnimationModal } from './animation-modal.js';

export const EndGame = (props) => {
  /*
    props: playerId (Colyseus state object of dead player)
  */
  if (!props.team) return;

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(Object.keys(props.team).length > 0);
  }, [props.team]);

  return (
    <AnimationModal isVisible={isVisible} size={300} onClose={props.onClose}>
      <View style={styles.container}>
        <ProfileIcon
          style={{ marginBottom: 20 }}
          team={props.team}
          size={200}
        />
        <Text
          style={{
            fontSize: 80,
            color: 'red',
            textAlign: 'center',
            fontFamily: 'Impostograph-Regular',
            flex: 2,
          }}
        >
          Game Over
        </Text>
        <Text
          style={{
            fontSize: 60,
            color: '#fff',
            textAlign: 'center',
            fontFamily: 'Impostograph-Regular',
          }}
        >
          {'\n'}The {props.team}
          {'\n'}
        </Text>
        <Text
          style={{
            fontSize: 50,
            color: '#888',
            textAlign: 'center',
            fontFamily: 'Impostograph-Regular',
          }}
        >
          team has won!
        </Text>
      </View>
    </AnimationModal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000',
    borderRadius: 15,
  },
});
