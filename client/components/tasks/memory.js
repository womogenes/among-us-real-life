import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import CustomText from '../text';

function MemoryTask(props) {
  const [code, setCode] = useState(props.code);
  const [input, setInput] = useState([-1, -1, -1, -1]);
  const [ind, setInd] = useState(0);
  const [disable, setDisable] = useState(true);
  const [green, setGreen] = useState(-1);
  const [loading, setLoading] = useState(true);

  const greenColor = '#AAFF00';
  const yellowColor = '#F7B500';
  const redColor = '#EE4B2B';

  useEffect(() => {
    if (props.active) {
      // could change code every time the task is opened, but then there are problems with the state not updating before the green squares are displayed
      // setCode(Array.from({ length: 4 }, () => Math.floor(Math.random() * 16)));
      // console.log(code);
      setInput([-1, -1, -1, -1]);
      setInd(0);
      setDisable(true);
      setLoading(false);
      let timer = [];
      let timerReset = [];
      code.forEach((item, i) => {
        timer[i] = setTimeout(() => {
          setGreen(item);
        }, (i + 1) * 750);
        timerReset[i] = setTimeout(() => {
          setGreen(-1);
        }, (i + 2) * 750 - 250);
      });
      const dis = setTimeout(() => {
        setDisable(false);
      }, code.length + 2 * 750 - 250);
      return () => {
        clearTimeout(dis);
        timer.forEach((t) => clearTimeout(t));
        timerReset.forEach((t) => clearTimeout(t));
      };
    } else {
      setLoading(true);
    }
  }, [props.active]);

  const keypad = [...Array(4).keys()].map((row) => (
    <View style={styles.row} key={`row: ${row}`}>
      {[...Array(4).keys()].map((col, i) => (
        <TouchableOpacity
          key={`key: ${row * 4 + col}`}
          style={[
            styles.key,
            {
              backgroundColor:
                green === row * 4 + col
                  ? greenColor
                  : input[ind - 1] === row * 4 + col &&
                    code[ind - 1] !== row * 4 + col
                  ? redColor
                  : '#a4a4a6',
            },
          ]}
          disabled={disable}
          onPress={() => {
            let c = input;
            c[ind] = row * 4 + col;
            setInd(ind + 1);
            setInput(c);
            if (code[ind] != c[ind]) {
              setDisable(true);
              const timer = setTimeout(() => {
                setInd(0);
                setInput([-1, -1, -1, -1]);
                setDisable(false);
                clearTimeout(timer);
              }, 1000);
            } else if (ind == code.length - 1) {
              props.complete('memory');
            }
          }}
        />
      ))}
    </View>
  ));

  return loading ? (
    <></>
  ) : (
    <Modal isVisible={props.active} style={{ alignItems: 'center' }}>
      <View style={styles.modal}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => props.closeTask('electricity')}
        >
          <CustomText textSize={30}>&#10006;</CustomText>
        </TouchableOpacity>
        <View style={styles.lights}>
          {[...Array(4).keys()].map((num) => (
            <View
              key={`light: ${num}`}
              style={[
                styles.circle,
                {
                  backgroundColor:
                    input[num] === code[num]
                      ? greenColor
                      : input[num] === -1
                      ? yellowColor
                      : redColor,
                },
              ]}
            />
          ))}
        </View>
        <View style={styles.keypad}>{keypad}</View>
      </View>
    </Modal>
  );
}

export default MemoryTask;

const styles = StyleSheet.create({
  modal: {
    backgroundColor: '#d7d6d8',
    alignItems: 'center',
    height: 405,
    width: 310,
    borderRadius: 15,
  },
  closeButton: {
    position: 'absolute',
    right: 5,
    top: 0,
    margin: 10,
  },
  lights: {
    height: 100,
    width: 300,
    borderRadius: 15,
    paddingHorizontal: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  circle: {
    height: 30,
    width: 30,
    borderRadius: 15,
    borderColor: '#3b3b3d',
    borderWidth: 2,
  },
  keypad: {
    height: 300,
    width: 300,
    borderRadius: 15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  key: {
    height: 75,
    width: 75,
    borderRadius: 5,
    borderColor: '#3b3b3d',
    borderWidth: 2,
  },
});
