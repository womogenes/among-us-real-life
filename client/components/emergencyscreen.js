import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Animated,
} from 'react-native';

import { useRef, useEffect, useState } from 'react';

import { findDistance, distAll, findClosest, findDirection } from '../utils.js';

import CustomText from '../components/text.js';

import Easing from 'react-native/Libraries/Animated/Easing';

function EmergencyScreen(props) {

  const [dirToMeeting, setDirToMeeting] = useState();
  const [distToMeeting, setDistToMeeting] = useState();

  useEffect(() => {
    setDirToMeeting(findDirection(props.playerLocation, props.meetingLocation))
    setDistToMeeting(findDistance(props.playerLocation, props.meetingLocation))
  }, [props.playerLocation, props.meetingLocation])

  return (
      <View style={styles.container}>
        {props.emergencyActive && props.playerAlive && 
          <View style={[styles.emergencyScreen, distToMeeting < 30? {backgroundColor: '#26cf00'} : {backgroundColor: '#ff0000e0'}]}>
            <CustomText
              textSize={70}
              letterSpacing={3}
              textColor={'#ffffffff'}
              centerText={true}
            >
              Emergency Meeting Called
            </CustomText>
            <CustomText textSize={30} centerText={true} textColor={'white'}>
              Actions are temporarily disabled
            </CustomText>
            <CustomText textSize={30} centerText={true} textColor={'white'}>
              {distToMeeting >= 30? <Text>Please follow the purple arrow</Text> : <Text>Waiting for other players</Text>}
            </CustomText>
            {distToMeeting >= 30 &&
              <View style={[styles.meetingCompass, {transform: [{ rotateZ: parseFloat(dirToMeeting + Math.PI) + 'rad' }]}]}>
                <View style={[styles.triangle, {borderBottomColor: '#c300ff'}]}></View>
              </View>
            }
          </View>
        }
      </View>

  );
}

export default EmergencyScreen;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  emergencyScreen: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    bottom: 0,
    padding: 20,
    paddingBottom: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  meetingCompass: {
    alignItems: 'center',
    borderRadius: 100,
    width: 100,
    height: 100,
    position: 'absolute',
    backgroundColor: 'black',
    bottom: '20%',
  },
  triangle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 15,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    position: 'absolute',
  },
});
