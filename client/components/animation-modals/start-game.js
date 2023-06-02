import {
  StyleSheet,
  View,
  Modal,
  TouchableOpacity,
  Text,
  ScrollView,
} from 'react-native';
import { ProfileIcon } from '../profile-icon';
import CustomText from '../text';
import { useState, useEffect } from 'react';
import { AnimationModal } from './animation-modal.js';

export const StartGame = (props) => {
  /*
    props: playerId (Colyseus state object of dead player)
  */

  function mapPlayers() {
    return props.isImpostor
      ? props.players?.map((player) => {
          return (
            <View
              key={player?.sessionId}
              style={[
                player?.isImpostor ? { opacity: 1 } : { opacity: 0.4 },
                styles.listItem,
              ]}
            >
              <ProfileIcon
                player={player}
                size={50}
                isImpostor={props.isImpostor}
                myId={props.sessionId}
              />
              <View style={styles.username}>
                <CustomText
                  textSize={30}
                  textColor={player?.isImpostor ? 'red' : 'black'}
                >
                  {player.username}
                </CustomText>
              </View>
            </View>
          );
        })
      : props.players?.map((player) => {
          return (
            <View key={player?.sessionId} style={[styles.listItem]}>
              <ProfileIcon player={player} size={50} myId={props.sessionId} />
              <View style={styles.username}>
                <CustomText textSize={30}>{player.username}</CustomText>
              </View>
            </View>
          );
        });
  }

  return (
    <AnimationModal
      isVisible={props.isVisible}
      height={'80%'}
      onClose={props.onClose}
    >
      <View style={styles.container}>
        <CustomText
          textSize={60}
          centerText={true}
          textColor={props.isImpostor ? 'red' : 'white'}
        >
          {props.isImpostor ? <Text>Impostor</Text> : <Text>Crewmate</Text>}
        </CustomText>
        <CustomText textSize={30} textColor={'#9c9c9c'} centerText={true}>
          {props.isImpostor ? (
            <Text>Be the last standing!</Text>
          ) : (
            <Text>There is an impostor among us!</Text>
          )}
        </CustomText>
        <ScrollView style={styles.profileList}>{mapPlayers()}</ScrollView>
      </View>
    </AnimationModal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000',
    borderRadius: 15,
  },
  profileList: {
    flexDirecion: 'row',
    width: '100%',
    padding: 5,
    marginTop: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
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
