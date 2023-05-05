import {
  StyleSheet,
  View,
  FlatList,
  Text,
  TouchableWithoutFeedback,
  Button,
} from 'react-native';
import Constants from 'expo-constants';
import { useEffect, useState } from 'react';
import Modal from 'react-native-modal';

import { getGameRoom } from '../networking.js';
import CustomText from './text.js';
import { ProfileIcon } from './profile-icon.js';

export default function votingModal(props) {
  const gameRoom = getGameRoom();

  const [timer, setTimer] = useState(props.timer);
  const [votes, setVotes] = useState(new Map());
  const [loading, setLoading] = useState(true);

  let playerArr = gameRoom.state.players;

  let user = gameRoom.state.players.filter(
    (p) => p.sessionId == gameRoom.sessionId
  )[0];

  useEffect(() => {
    if (props.isModalVisible) {
      // basically a reset
      setTimer(props.timer);
      setVotes(new Map());
      setLoading(false);
    }
  }, [props.isModalVisible]);

  useEffect(() => {
    if (!loading) {
      let countdown = setTimeout(() => {
        setTimer(timer - 1);
      }, 1000);

      if (!props.isModalVisible) {
        setLoading(true);
        return clearTimeout(countdown);
      }
    }
  });

  useEffect(() => {
    gameRoom.state.votes.onChange = (target, player) => {
      // console.log(player, ' has voted for ', target);
      // console.log(getGameRoom().state.votes.$items);
      setVotes((prev) => ({ ...prev, [player]: target }));
    };
    gameRoom.state.votes.onAdd = (target, player) => {
      // console.log(player, ' has voted for ', target);
      // console.log(getGameRoom().state.votes.$items);
      setVotes((prev) => ({ ...prev, [player]: target }));
    };
  }, []);

  return (
    <Modal isVisible={props.isModalVisible} animationType="slide">
      <View style={styles.votingModal}>
        {/* <Button
          onPress={() =>
            console.log(
              new Map(getGameRoom().state.votes.$items),
              ' , ',
              Object.keys(votes)
            )
          }
          title="test click (log)"
        ></Button> */}
        <FlatList
          data={playerArr}
          renderItem={({ item }) => (
            <TouchableWithoutFeedback
              onPress={() => {
                //may have to change how this is done later
                //using ids?
                getGameRoom()?.send('vote', {
                  [user.sessionId]: item.sessionId,
                });
              }}
            >
              <View style={styles.candidate}>
                <CustomText
                  textColor={'black'}
                  centerText={false}
                  textSize={40}
                >
                  {item.username}
                </CustomText>

                {/* maybe change to view later for icons? */}
                <View style={styles.votes}>
                  {Object.keys(votes)
                    .filter(
                      // change this to icons later
                      (key) => votes[key] == item.sessionId
                    )
                    .map((playerId) => {
                      const player = getGameRoom().state.players.find(
                        (p) => p.sessionId === playerId
                      );
                      return (
                        <ProfileIcon
                          player={player}
                          size={20}
                          key={player.sessionId}
                        />
                      );
                    })}
                </View>
              </View>
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
  votingModal: {
    marginTop: Constants.statusBarHeight,
    paddingTop: 10,
    borderRadius: 20,
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    color: '#000',
  },
  player: {
    width: '100%',
  },
  red: {
    color: 'red',
  },
  candidate: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
    borderWidth: 2,
    borderRadius: 15,
    marginHorizontal: 20,
    marginVertical: 10,
    padding: 10,
  },
  votes: {
    alignSelf: 'flex-end',
    textAlign: 'right',
  },
});
