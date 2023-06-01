import { StyleSheet, View, Modal, TouchableOpacity, Text, ScrollView } from 'react-native';
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

  function mapPlayers(){
    return(
      props.players?.map((player) => {
        return(
          <View key={player?.sessionId} style={[player?.isAlive? {opacity: 1} : {opacity: 0.4}, styles.listItem]}>
            <View style={[styles.profileContainer,
              props.team && props.team === 'impostor' ?
                player?.isImpostor? [{shadowOpacity: 0.9}, {shadowColor: '#fff700'}, {shadowRadius: 16}]
                : {shadowOpacity: 0}
              : !player?.isImpostor? [{shadowOpacity: 0.9}, {shadowColor: '#fff700'}, {shadowRadius: 16}]
                : {shadowOpacity: 0}]}
            >
              <ProfileIcon player={player} size={50} isImpostor={true} myId={props.myId}/>
            </View>
            <View style={styles.username}>
              <CustomText textSize={30} textColor={player?.isImpostor? 'red': 'black'}>{player.username}</CustomText>
            </View>
          </View>
        );
      })
    )
  }
  return (
    <AnimationModal isVisible={isVisible} height={'80%'} onClose={props.onClose}>
      <View style={styles.container}>
        <View style={styles.fit}>
          <CustomText textSize={80} textColor={'red'} textAlign={'center'}>
            <Text>Game Over</Text>
          </CustomText>
          <CustomText textSize={60} textColor={'#fff'} textAlign={'center'}>
            <Text>The {props.team}</Text>            
          </CustomText>
          <CustomText textSize={50} textColor={'#888'} textAlign={'center'}>
            <Text>team has won!</Text>
          </CustomText>
          <ScrollView style={styles.profileList}>
            {mapPlayers()}
          </ScrollView>
        </View>
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
  profileContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
    width: 50,
    height: 50,
    backgroundColor: 'red'
  },
  fit: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileList: {
    flexDirecion: 'row',
    width: '80%',
    height: '50%',
    padding: 5,
    margin: 5,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
  },
  listItem: {
    margin: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  username: {
    margin: 5,
  },
});
