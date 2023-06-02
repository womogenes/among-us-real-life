import { StyleSheet, View, Text, TouchableOpacity, Switch } from 'react-native';

import { useRef, useEffect, useState } from 'react';

import Modal from 'react-native-modal';

import CustomButton from '../components/button.js';
import CustomText from '../components/text.js';
import TaskBar from '../components/taskbar.js';
import TaskMenu from '../components/taskmenu.js';

import AxisPad from '../components/axispad.js';
import { getGameRoom } from '../networking.js';

function ControlPanel(props) {
  const [killTimer, setKillTimer] = useState(null);
  const [sabotageTimer, setSabotageTimer] = useState(null);
  const [killID, setKillID] = useState();
  const [saboID, setSaboID] = useState();
  const [isModalVisible, setModalVisibility] = useState(false);
  const { manualMovement, setManualMovement } = props;

  function killCooldown() {
    setKillTimer(props.killCooldown);
    const interval = setInterval(() => {
      setKillTimer((prevState) => prevState - 1);
    }, 1000);
    setKillID(interval);
  }

  function sabotageCooldown() {
    setSabotageTimer(props.sabotageCooldown);
    const interval = setInterval(() => {
      setSabotageTimer((prevState) => prevState - 1);
    }, 1000);
    setSaboID(interval);
  }

  function sabotageTasks() {
    setModalVisibility(true);
  }

  function closeSabotageTasks() {
    setModalVisibility(false);
  }

  useEffect(() => {
    if (killTimer <= 0) {
      clearInterval(killID);
      setKillTimer(null);
    }
  }, [killTimer]);

  useEffect(() => {
    if (sabotageTimer <= 0) {
      clearInterval(saboID);
      setSabotageTimer(null);
      () => props.endSabotageCooldown();
    }
  }, [sabotageTimer]);

  useEffect(() => {
    if (props.sabotageActive) {
      closeSabotageTasks();
    }
  }, [props.sabotageActive]);

  useEffect(() => {
    if (props.sabotageOnCooldown) {
      sabotageCooldown();
      props.endSabotageCooldown();
    }
  }, [props.sabotageOnCooldown]);

  useEffect(() => {
    if (props.killOnCooldown) {
      killCooldown();
      props.endKillCooldown();
    }
  }, [props.killOnCooldown]);

  return (
    <View style={styles.bottom}>
      <View style={styles.buttonContainer}>
        {/* Universal views */}
        <View style={{ flex: 1, alignItems: 'center' }}>
          {(Platform.OS == 'android' || manualMovement) && (
            <AxisPad
              size={100}
              handlerSize={50}
              resetOnRelease={true}
              autoCenter={true}
              onValue={({ x, y }) => {
                const dLat = -y * 0.00002;
                const dLong = x * 0.00002;
                getGameRoom()?.send('deltaLocation', {
                  latitude: dLat,
                  longitude: dLong,
                });
              }}
            ></AxisPad>
          )}
          <View>
            <CustomText textSize={18}>Manual</CustomText>
            <Switch
              trackColor={{ false: '#888', true: '#666' }}
              thumbColor={manualMovement ? '#fff' : '#fff'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={(value) => {
                setManualMovement(value);
              }}
              value={manualMovement}
            />
          </View>
        </View>

        {/* Role-specific buttons */}
        {props.userType == 'crewmate' && (
          <>
            <CustomButton
              type={'image'}
              disabled={props.useButtonState}
              onPress={props.useButtonPress}
              image={require('client/assets/usebutton.png')}
              roundness={50}
              backgroundColor={'#00000000'}
            />
            <CustomButton
              type={'image'}
              disabled={props.reportButtonState}
              onPress={props.reportButtonPress}
              image={require('client/assets/reportbutton.png')}
              roundness={50}
              backgroundColor={'#00000000'}
            />
          </>
        )}
        {props.userType == 'impostor' && (
          <>
            <CustomButton
              type={'text'}
              text={'DISGUISE'}
              textSize={30}
              disabled={props.disguiseButtonState}
              onPress={props.disguiseButtonPress}
              backgroundColor={'#00000000'}
            />
            <CustomButton
              type={'cooldown'}
              disabled={props.killButtonState}
              onPress={() => {
                props.killButtonPress();
                killCooldown();
              }}
              killOnCooldown={props.killOnCooldown}
              cooldownTimer={killTimer}
              text={killTimer}
              image={require('client/assets/killbutton.png')}
              backgroundColor={'#00000000'}
            />
            {props.sabotageActive || props.emergencyButton ? (
              <CustomButton
                type={'image'}
                disabled={props.useButtonState}
                onPress={props.useButtonPress}
                image={require('client/assets/usebutton.png')}
                roundness={50}
                backgroundColor={'#00000000'}
              />
            ) : (
              <CustomButton
                type={'cooldown'}
                disabled={props.sabotageButtonState}
                onPress={() => {
                  sabotageTasks();
                }}
                cooldownTimer={sabotageTimer}
                text={sabotageTimer}
                image={require('client/assets/sabotagebutton.png')}
                backgroundColor={'#00000000'}
              />
            )}
            <CustomButton
              type={'image'}
              disabled={props.reportButtonState}
              onPress={props.reportButtonPress}
              image={require('client/assets/reportbutton.png')}
              backgroundColor={'#00000000'}
            />
            <Modal
              isVisible={isModalVisible && !props.emergencyActive}
              style={styles.modal}
            >
              <View style={styles.modalBackground}>
                <View style={styles.closeButtonContainer}>
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={closeSabotageTasks}
                  >
                    <Text style={styles.closeButtonText}>&#x2716;</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.modalTitle}>Sabotage</Text>
                <TouchableOpacity
                  style={styles.sabotageListButton}
                  onPress={props.o2}
                >
                  <Text style={styles.sabotageListButtonText}>o2</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.sabotageListButton}
                  onPress={props.reactor}
                >
                  <Text style={styles.sabotageListButtonText}>reactor</Text>
                </TouchableOpacity>
              </View>
            </Modal>
          </>
        )}
        {props.userType == 'disguisedimpostor' && (
          <>
            <CustomButton
              type={'image'}
              disabled={null}
              onPress={props.revealButtonPress}
              image={require('client/assets/usebutton.png')}
              backgroundColor={'#00000000'}
            />
            <CustomButton
              type={'image'}
              disabled={props.reportButtonState}
              onPress={props.reportButtonPress}
              image={require('client/assets/reportbutton.png')}
              backgroundColor={'#00000000'}
            />
          </>
        )}
      </View>

      <TaskMenu tasks={props.tasks} />
      <TaskBar taskCompletion={props.taskCompletion} />
    </View>
  );
}

export default ControlPanel;

const styles = StyleSheet.create({
  bottom: {
    width: '100%',
    backgroundColor: '#00000000',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
  },
  buttonContainer: {
    flex: 1,
    alignSelf: 'flex-end',
    bottom: 120,
  },
  modal: {
    alignItems: 'center',
  },
  modalBackground: {
    width: '95%',
    height: '63%',
    backgroundColor: 'white',
    alignItems: 'center',
    position: 'absolute',
    borderRadius: 20,
    padding: 5,
  },
  modalTitle: {
    fontSize: 70,
    marginBottom: 10,
    marginTop: -10,
    fontFamily: 'Impostograph-Regular',
  },
  closeButtonContainer: {
    width: '100%',
    alignItems: 'flex-end',
  },
  closeButtonText: {
    marginHorizontal: 10,
    fontSize: 30,
  },
  sabotageListButton: {
    width: '80%',
    height: '13%',
    borderWidth: 2,
    borderRadius: 10,
    margin: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sabotageListButtonText: {
    fontSize: 40,
    fontFamily: 'Impostograph-Regular',
  },
});
