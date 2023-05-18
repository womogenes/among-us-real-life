import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import { Slider } from '@miblanchard/react-native-slider';
import Modal from 'react-native-modal';

import CustomText from '../text.js';

function ElectricityTask(props) {
  const [code, setCode] = useState(props.code);
  const [sliders, setSliders] = useState([
    Math.floor(Math.random() * 9),
    Math.floor(Math.random() * 9),
    Math.floor(Math.random() * 9),
  ]);
  const [refresh, setRefresh] = useState(0);
  const [loading, setLoading] = useState(true);

  const greenColor = '#AAFF00';
  const yellowColor = '#F7B500';
  const redColor = '#EE4B2B';

  useEffect(() => {
    if (props.active) {
      console.log(code);
      setSliders([
        Math.floor(Math.random() * 9),
        Math.floor(Math.random() * 9),
        Math.floor(Math.random() * 9),
      ]);
      setCode(Array.from({ length: 3 }, () => Math.floor(Math.random() * 9)));
      setLoading(false);
    } else {
      setLoading(true);
    }
  }, [props.active]);

  useEffect(() => {
    if (!loading) {
      for (var i = 0; i < 3; i++) {
        if (code[i] !== sliders[i]) {
          break;
        }
        const end = setTimeout(() => {
          props.complete('electricity');
        }, 500);

        return () => {
          clearTimeout(end);
        };
      }
    }
  }, [sliders, refresh]);

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
        <Image source={require('../../assets/electricitySlider.png')}></Image>

        <View style={styles.sliderContainer}>
          {[...Array(3).keys()].map((num) => (
            <View style={styles.slider} key={num}>
              <Slider
                key={num}
                value={sliders[num]}
                minimumValue={0}
                maximumValue={8}
                step={1}
                vertical
                thumbStyle={{
                  width: 60,
                  height: 30,
                  backgroundColor: yellowColor,
                }}
                width={200}
                onValueChange={(value) => {
                  let c = sliders;
                  c[num] = value[0];
                  setSliders(c);
                  setRefresh(refresh + 1);
                }}
              />

              <View
                style={[
                  styles.circle,
                  {
                    backgroundColor:
                      sliders[num] === code[num] ? greenColor : redColor,
                  },
                ]}
              />
            </View>
          ))}
        </View>
      </View>
    </Modal>
  );
}

export default ElectricityTask;

const styles = StyleSheet.create({
  modal: {
    backgroundColor: '#d7d6d8',
    alignItems: 'center',
    height: 405,
    width: 310,
    borderRadius: 15,
  },
  sliderContainer: {
    height: 250,
    width: 250,
    marginTop: 30,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    flexDirection: 'row',
  },
  slider: {
    flexDirection: 'column',
  },
  image: {
    width: 80,
    height: 50,
  },
  closeButton: {
    position: 'absolute',
    right: 5,
    top: 0,
    margin: 10,
  },
  circle: {
    marginTop: 100,
    marginLeft: 85,
    height: 30,
    width: 30,
    borderRadius: 15,
  },
});
