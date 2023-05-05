import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import { Slider } from '@miblanchard/react-native-slider';
import Modal from 'react-native-modal';

function ElectricityTask(props) {
  const [code, setCode] = useState(
    Array.from({ length: 3 }, () => Math.floor(Math.random() * 9))
  );
  const [sliders, setSliders] = useState([
    Math.floor(Math.random() * 9),
    Math.floor(Math.random() * 9),
    Math.floor(Math.random() * 9),
  ]);

  const greenColor = '#AAFF00';
  const yellowColor = '#F7B500';
  const redColor = '#EE4B2B';

  useEffect(() => {
    if (props.active) {
    }
  }, [props.active]);

  return (
    <Modal isVisible={props.active} style={{ alignItems: 'center' }}>
      <View style={styles.modal}>
        {[...Array(3).keys()].map((num) => (
          <View style={styles.sliderContainer} key={num}>
            <Text>this is under construction</Text>
            <Slider
              value={sliders[num]}
              minimumValue={0}
              maximumValue={8}
              step={1}
              renderThumbComponent={() => {
                <View style={styles.image}>
                  <Text>test</Text>
                  <Image
                    source={require('../../assets/electricitySlider.png')}
                  />
                </View>;
              }}
              onValueChange={(value) => {
                let c = sliders;
                c[num] = value;
                setSliders(c);
              }}
            />
          </View>
        ))}
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
    flex: 1,
    marginLeft: 10,
    marginRight: 10,
    alignItems: 'stretch',
    justifyContent: 'space-evenly',
    // transform: [{ rotate: '90deg' }],
  },
  image: {
    backgroundColor: 'powderblue',
    width: 80,
    height: 50,
  },
});
