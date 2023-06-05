// Tutorial: https://medium.com/react-native-rocket/building-a-hand-drawing-app-with-react-native-skia-and-gesture-handler-9797f5f7b9b4

import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';

import CustomText from '../text.js';

import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import { Canvas, Path, Rect } from '@shopify/react-native-skia';

function WiresTask(props) {
  // Should randomize eventually
  const wireColors = [
    '#2626ff', // Blue
    '#fdeb04', // Yellow
    '#fc0706', // Red
    '#fe01ff', // Pink
  ];
  const mixedWires = [3, 2, 0, 1];
  const [completedWires, setCompletedWires] = useState([
    false,
    false,
    false,
    false,
  ]);
  const i2start = (i) => {
    return { x: 0, y: i * 100 + 50 };
  };
  const i2end = (i) => {
    return { x: 260, y: i * 100 + 50 };
  };

  const [curWire, setCurWire] = useState(-1);
  const [curEnd, setCurEnd] = useState({ x: 0, y: 0 });

  const pan = Gesture.Pan()
    .onStart((g) => {
      const { x, y } = g;

      // Detect start
      let theWire = -1;
      for (let i = 0; i < 4; i++) {
        const startPos = i2start(i);
        if (
          x < startPos.x + 100 &&
          y > startPos.y - 20 &&
          y < startPos.y + 30
        ) {
          theWire = i;
          break;
        }
      }
      if (theWire == -1) return;

      console.log(completedWires);
      if (completedWires[theWire]) return;
      setCurWire(theWire);
    })
    .onUpdate((g) => {
      if (curWire == -1) return;

      // Detect end
      const { x, y } = g;
      let theWire = -1;
      for (let i = 0; i < 4; i++) {
        const endPos = i2end(i);
        if (x > endPos.x - 10 && y > endPos.y - 20 && y < endPos.y + 30) {
          theWire = i;
          break;
        }
      }
      if (mixedWires[theWire] === curWire) {
        setCompletedWires((cw) => {
          cw[curWire] = true;

          // Are we all done?
          if (completedWires.every((x) => x)) {
            setTimeout(() => {
              props.complete('wires');
              props.closeTask('wires');
            }, 500);
          }

          return cw;
        });
        setCurWire(-1);
        return;
      }

      setCurEnd(g);
    })
    .onEnd(() => setCurWire(-1))
    .minDistance(1);

  return (
    <Modal isVisible={props.active} style={{ alignItems: 'center' }}>
      <View style={styles.modal}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => props.closeTask('electricity')}
        >
          <CustomText textSize={30}>&#10006;</CustomText>
        </TouchableOpacity>

        <GestureHandlerRootView style={{ width: '100%', height: '100%' }}>
          <GestureDetector gesture={pan}>
            <View
              style={{ flex: 1, backgroundColor: 'black', borderRadius: 15 }}
            >
              <Canvas style={{ width: '100%', height: '100%', flex: 8 }}>
                {/* Stars and ends */}
                {wireColors.map((color, i) => (
                  <Rect
                    x={i2start(i).x}
                    y={i2start(i).y}
                    width={50}
                    height={20}
                    color={color}
                    key={`rectStart_${i}`}
                  />
                ))}
                {mixedWires.map((j, i) => (
                  <Rect
                    x={i2end(i).x}
                    y={i2end(i).y}
                    width={50}
                    height={20}
                    color={wireColors[j]}
                    key={`rectEnd_${i}`}
                  />
                ))}
                {/* Completed wires */}
                {completedWires.map((done, i) => {
                  if (!done) return;
                  const startPos = i2start(i);
                  const endPos = i2end(mixedWires.indexOf(i));

                  const path = `M ${startPos.x + 45} ${startPos.y + 10} L ${
                    endPos.x + 5
                  } ${endPos.y + 10} Z`;

                  return (
                    <Path
                      path={path}
                      strokeWidth={20}
                      style="stroke"
                      strokeLinecap="round"
                      color={wireColors[i]}
                      key={`completedWire_${i}`}
                    ></Path>
                  );
                })}
                {/* Incomplete wire */}
                {curWire != -1 && (
                  <Path
                    path={`M ${i2start(curWire).x + 45} ${
                      i2start(curWire).y + 10
                    } L ${curEnd.x} ${curEnd.y} Z`}
                    strokeWidth={20}
                    style="stroke"
                    color={wireColors[curWire]}
                    key="incompleteWire"
                  />
                )}
              </Canvas>
            </View>
          </GestureDetector>
        </GestureHandlerRootView>
      </View>
    </Modal>
  );
}

export default WiresTask;

const styles = StyleSheet.create({
  modal: {
    display: 'flex',
    backgroundColor: '#d7d6d8',
    alignItems: 'center',
    height: 405,
    width: 310,
    borderRadius: 15,
    zIndex: 9999,
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
    zIndex: 10,
  },
  circle: {
    marginTop: 100,
    marginLeft: 85,
    height: 30,
    width: 30,
    borderRadius: 15,
  },
});
