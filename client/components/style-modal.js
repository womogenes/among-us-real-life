import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, TouchableOpacity, Animated, Text, Image, ScrollView } from 'react-native';
import Modal from 'react-native-modal';
import CustomText from '../components/text.js';
import { ProfileIcon } from '../components/profile-icon.js';

export const StyleModal = ({ active, icons, gameRoom, sessionId, onClose }) => {

  const renderIcons = () => {
    return(
      icons?.map((icon) => {
        let disabled;
        let player = gameRoom.state.players?.find((p) => p?.icon?.name === icon?.name)
        let yourIcon;
        let iconOpacity = 1;
        if(player){
          if(player.sessionId !== sessionId) {
            disabled = true
            iconOpacity = 0.5;
          }
          else{
            disabled = false
            yourIcon = true;
          }
        }
        else{
          disabled = false
        }
        return(
          <TouchableOpacity disabled={disabled} onPress={() => selectIcon(icon?.name)} key={icon?.name}>
            <ProfileIcon
              style={[{margin: 2}, yourIcon && {backgroundColor: '#ffd666'}, {opacity: iconOpacity}]}
              size={60}
              renderIcon={icon && icon}
            />
          </TouchableOpacity>
        )
      })
    )
  }

  function selectIcon(name) {
    gameRoom.send('updateIcon', name);
  }

  return (
    <Modal isVisible={active}>
      <View style={styles.modal}>
        <View style={styles.masterContainer}>
          <CustomText textSize={40} textAlign={'center'} textColor={'black'}>
            <Text style={{textAlign: 'center'}}>Choose your skin</Text>
          </CustomText>
          <ScrollView>
            <View style={styles.iconList}>
              {renderIcons()}
            </View>
          </ScrollView>
        </View>
        <TouchableOpacity
            style={styles.closeButton}
            onPress={() => onClose()}
        >
            <CustomText textSize={30}>&#10006;</CustomText>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    margin: 50,
    marginTop: 200,
    marginBottom: 200,
    borderRadius: 20,
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    color: '#000',
    overflow: 'hidden',
  },
  closeButton: {
    position: 'absolute',
    right: 0,
    top: 0,
    margin: 10,
  },
  masterContainer: {
    width: '100%',
    height: '100%',
    padding: 10,
    paddingTop: 50,
    paddingBottom: 20,
  },
  iconList: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    flexDirection: 'row',
    borderRadius: 20,
  }
});
