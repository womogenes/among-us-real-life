import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, TouchableOpacity, Animated, Text, Image, ScrollView } from 'react-native';
import Modal from 'react-native-modal';
import CustomText from '../components/text.js';
import { ProfileIcon } from '../components/profile-icon.js';

export const StyleModal = ({ active, skins, hats, gameRoom, sessionId, onClose }) => {

  const [mode, setMode] = useState('skin');

  const renderSkins = () => {
    return(
      skins?.map((skin) => {
        let disabled;
        let player = gameRoom.state.players?.find((p) => p?.icon?.skin?.name === skin?.name)
        let yourSkin;
        let skinOpacity = 1;
        if(player){
          if(player.sessionId !== sessionId) {
            disabled = true
            skinOpacity = 0.5;
          }
          else{
            disabled = false
            yourSkin = true;
          }
        }
        else{
          disabled = false
        }
        return(
          <TouchableOpacity disabled={disabled} onPress={() => selectSkin(skin?.name)} key={skin?.name}>
            <ProfileIcon
              style={[{margin: 2}, yourSkin && {backgroundColor: '#ffd666'}, {opacity: skinOpacity}]}
              size={60}
              renderSkin={skin}
            />
          </TouchableOpacity>
        )
      })
    )
  }

  const renderHats = () => {
    return(
      hats?.map((hat) => {
        let yourHat;
        let player = gameRoom.state.players?.find((p) => p.sessionId === sessionId)
        if(player?.icon?.hat?.name === hat.name){
          yourHat = true;
        }
        else{
          yourHat = false;
        }
        return(
          <TouchableOpacity onPress={() => selectHat(hat?.name)} key={hat?.name}>
            <ProfileIcon
              style={[{margin: 2}, yourHat && {backgroundColor: '#ffd666'}, {overflow: 'visible'}]}
              size={60}
              renderHat={hat}
            />
          </TouchableOpacity>
        )
      })
    )
  }

  function changeMode() {
    if(mode === 'skin'){
      setMode('hat');
    }
    else if(mode === 'hat'){
      setMode('skin');
    }
  }

  function selectSkin(name) {
    gameRoom.send('updateSkin', name);
  }

  function selectHat(name) {
    gameRoom.send('updateHat', name);
  }

  return (
    <Modal isVisible={active}>
      <View style={styles.modal}>
        <View style={styles.masterContainer}>
          <TouchableOpacity onPress={() => changeMode()}>
            <CustomText textSize={40} textAlign={'center'} textColor={'black'}>
              {mode === 'skin'? <Text style={{textAlign: 'center'}}>Choose your skin</Text> : <Text style={{textAlign: 'center'}}>Choose your hat</Text>}
            </CustomText>
          </TouchableOpacity>
          <ScrollView>
            {mode === 'skin'?       
              <View style={styles.list}>
                {renderSkins()}
              </View>            
              : 
              <View style={styles.list}>
                {renderHats()}
              </View>
            }
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
  list: {
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
