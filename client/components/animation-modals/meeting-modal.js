import { StyleSheet, View, Modal, TouchableOpacity, Text, Image } from 'react-native';
import { ProfileIcon } from '../profile-icon';
import CustomText from '../text';
import { useState, useEffect } from 'react';
import { AnimationModal } from './animation-modal.js';

export const MeetingModal = (props) => {

  const images = {x: require('../../assets/x.png')}
  return (
    <AnimationModal isVisible={props.isVisible} onClose={props.onClose}>
      <View style={styles.container}>
        {props.dead? 
          <View style={styles.container2}>
            <ProfileIcon player={props.dead} size={200}/>
            <View style={styles.imageContainer}>
              <Image style={styles.image} source={images.x}/>
            </View>
            <CustomText textSize={50} textAlign={'center'} textColor={'white'}>
              <Text>Body Reported!</Text>
            </CustomText>
          </View>
        :
          <View style={styles.container2}>
            <ProfileIcon player={props.reporter} size={200}/>
            <CustomText textSize={50} textAlign={'center'} textColor={'white'}>
              <Text style={{textAlign: 'center'}}>Emergency Meeting Called!</Text>
            </CustomText>
          </View>
        }
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
  container2: {
    flex: 1,
    width: '100%',
    height: '100%',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000',
    borderRadius: 15,
  },
  imageContainer: {
    position: 'absolute',
    top: 70,
    transform: [{rotateZ: '10deg'}],
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 300,
    height: 300,
    resizeMode:'contain',
  },
});
