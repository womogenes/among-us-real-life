import { StyleSheet, View, Text, TouchableOpacity, Button } from 'react-native';

import { useRef, useEffect, useState } from 'react';

import Modal from 'react-native-modal';

import CustomButton from '../components/button.js';
import CustomText from '../components/text.js';
import TaskBar from '../components/taskbar.js';
import TaskMenu from '../components/taskmenu.js';

function ControlPanel(props) {
  const [timer, setTimer] = useState(null);
  const [intervalID, setIntervalID] = useState();
  const [isModalVisible, setModalVisibility] = useState(false);

  function killCooldown() {
    setTimer(props.cooldown);
    const interval = setInterval(() => {
      setTimer((prevState) => prevState - 1);
    }, 1000);
    setIntervalID(interval);
  }

  function renderSabotageTasks() {
    return props.sabotageList.map((item) => {
      return (
        <TouchableOpacity style={styles.sabotageListButton} key={item.key}>
          <Text style={styles.sabotageListButtonText}>{item.name}</Text>
        </TouchableOpacity>
      );
    });
  }

  function sabotageTasks() {
    setModalVisibility(true);
  }

  function closeSabotageTasks() {
    setModalVisibility(false);
  }

  useEffect(() => {
    if (timer <= 0) {
      clearInterval(intervalID);
      setTimer(null);
    }
  }, [timer]);

  return (
    <View style={styles.bottom}>
      {/* Universal views */}
      <View
        style={{
          right: -10,
          bottom: 400,
          width: 20,
          height: 20,
          backgroundColor: '#000',
          position: 'absolute',
        }}
      >
        <CustomText>Hello</CustomText>
      </View>

      {/* Role-specific buttons */}
      {props.userType == 'crewmate' && (
        <View style={styles.buttonContainer}>
          <CustomButton
            type={'image'}
            disabled={props.useButtonState}
            onPress={props.useButtonPress}
            image={require('client/assets/usebutton.png')}
            imageSize={'75%'}
            roundness={50}
            backgroundColor={'#00000000'}
            width={150}
            height={150}
          />
          <CustomButton
            type={'image'}
            disabled={props.reportButtonState}
            onPress={props.reportButtonPress}
            image={require('client/assets/reportbutton.png')}
            imageSize={'75%'}
            roundness={50}
            backgroundColor={'#00000000'}
            width={150}
            height={150}
          />
        </View>
      )}
      {props.userType == 'impostor' && (
        <View style={styles.buttonContainer}>
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
            cooldownTimer={timer}
            text={timer}
            image={require('client/assets/killbutton.png')}
            backgroundColor={'#00000000'}
          />
          <CustomButton
            type={'cooldown'}
            disabled={props.sabotageButtonState}
            onPress={() => {
              sabotageTasks();
            }}
            image={require('client/assets/sabotagebutton.png')}
            backgroundColor={'#00000000'}
          />
          <CustomButton
            type={'image'}
            disabled={props.reportButtonState}
            onPress={props.reportButtonPress}
            image={require('client/assets/reportbutton.png')}
            backgroundColor={'#00000000'}
          />
          <Modal isVisible={isModalVisible} style={styles.modal}>
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
              {renderSabotageTasks()}
            </View>
          </Modal>
        </View>
      )}
      {props.userType == 'disguisedimpostor' && (
        <View style={styles.buttonContainer}>
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
        </View>
      )}

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
    margin: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sabotageListButtonText: {
    fontSize: 40,
    fontFamily: 'Impostograph-Regular',
  },
});
