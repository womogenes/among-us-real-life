import { StyleSheet, View, Modal, TouchableOpacity, Text } from 'react-native';
import { ProfileIcon } from '../profile-icon';
import CustomText from '../text';
import { useState, useEffect } from 'react';
import { AnimationModal } from './animation-modal.js';

export const EjectModal = (props) => {
  /*
    props: playerId (Colyseus state object of dead player)
  */
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(props.player && Object.keys(props.player).length > 0);
  }, [props.player]);

  return (
    <AnimationModal isVisible={isVisible} size={100} onClose={props.onClose}>
      <View style={styles.container}>
        <Text>{isVisible}</Text>
        <ProfileIcon
          style={{ marginBottom: 20 }}
          player={props.player}
          size={200}
        />
        <CustomText textSize={40} centerText={true}>
          <Text style={{ fontSize: 60, color: '#fff' }}>
            {props.player?.username}
            {'\n'}
          </Text>
          <Text style={{ color: '#888' }}>
            {props.player?.isImpostor ? ' was ' : ' was not '}
            the impostor
          </Text>
        </CustomText>
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
