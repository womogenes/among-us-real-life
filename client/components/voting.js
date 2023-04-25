import {
  StyleSheet,
  View,
  FlatList,
  Text,
  TouchableWithoutFeedback,
} from 'react-native';
import { useRef, useEffect, useState } from 'react';
import Modal from 'react-native-modal';

import { getGameRoom, lobbyRoom } from '../networking.js';
import CustomText from './text.js';

export default function VotingModal(props) {
  const [timer, setTimer] = useState(props.timer);

  let playerArr = getGameRoom().state.players;

  useEffect(() => {
    let countdown = setTimeout(() => {
      setTimer(timer - 1);
    }, 1000);

    if (!props.isModalVisible) {
      return clearTimeout(countdown);
    }
  });

  return (
    <Modal isVisible={props.isModalVisible} animationType="slide">
      <View style={styles.votingmodal}>
        <FlatList
          data={playerArr}
          renderItem={({ item }) => (
            <TouchableWithoutFeedback>
              <CustomText
                textColor={'black'}
                centerText={true}
                textSize={50}
                marginHorizontal={20}
                marginVertical={10}
                padding={10}
                borderWidth={2}
                borderRadius={15}
              >
                {item.username || 'Anonymous'}
              </CustomText>
            </TouchableWithoutFeedback>
          )}
          style={styles.player}
        />
        <CustomText
          textColor={'black'}
          centerText={true}
          textSize={40}
          marginVertical={10}
        >
          Voting ends in <Text style={styles.red}>{timer}</Text> sec
        </CustomText>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  votingmodal: {
    borderRadius: 20,
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    color: '#000',
  },
  player: {
    flex: 0.9,
    width: '100%',
  },
  red: {
    color: 'red',
  },
});
