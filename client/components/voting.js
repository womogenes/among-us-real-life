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

  const [votes, setVotes] = useState(new Map());

  let playerArr = gameRoom.state.players;

  let user = gameRoom.state.players.filter(
    (p) => p.sessionId == gameRoom.sessionId
  )[0];

  useEffect(() => {
    gameRoom.onStateChange((state) => {
      // console.log(player, ' has voted for ', target);
      // console.log(getGameRoom().state.votes.$items);
      const votes = Array.from(state.votes);
      setVotes(votes);
    });

    return () => {
      gameRoom.removeAllListeners();
    };
  }, []);

  return (
    <Modal isVisible={props.isVisible} animationType="slide">
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
          data={[
            ...playerArr,
            {
              sessionId: 'skip', // ! HACK ! terrible naming convention
              isAlive: true, // ugh ugh ugh
              username: 'SKIP',
            },
          ]}
          renderItem={({ item }) => (
            <TouchableWithoutFeedback
              onPress={() => {
                // may have to change how this is done later
                // using ids?
                if (!item.isAlive) return;

                getGameRoom()?.send('vote', item.sessionId);
              }}
              key={item.sessionId}
            >
              <View
                style={[
                  styles.candidate,
                  {
                    opacity: item.isAlive ? 1 : 0.5,
                    borderColor: item.isAlive ? '#000' : '#f00',
                  },
                  props.yourId === item.sessionId && {
                    backgroundColor: '#ffd666',
                  },
                  { marginLeft: 5 },
                ]}
              >
                <ProfileIcon player={item} size={50} key={item.sessionId} />
                <CustomText
                  textColor={'black'}
                  centerText={false}
                  textSize={40}
                >
                  {item.username}
                </CustomText>

                <View style={styles.votes}>
                  {votes
                    ?.filter(([key, playerId]) => playerId == item.sessionId)
                    ?.map(([key, playerId]) => {
                      const player = gameRoom.state.players.find(
                        (p) => p.sessionId === key
                      );
                      return (
                        <View style={{ marginLeft: 5 }} key={key}>
                          <ProfileIcon player={player} size={20} />
                        </View>
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
          Voting ends in <Text style={styles.red}>{props.timer}</Text> sec
        </CustomText>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  votingModal: {
    marginTop: Constants.statusBarHeight,
    marginBottom: 10,
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
    borderRadius: 10,
    marginHorizontal: 20,
    marginVertical: 10,
    padding: 10,
  },
  votes: {
    display: 'flex',
    flexDirection: 'row',
    alignSelf: 'flex-end',
  },
});
