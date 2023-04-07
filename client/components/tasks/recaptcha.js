import { StatusBar } from 'expo-status-bar';
import React, { useRef, useEffect } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';

import Recaptcha from 'react-native-recaptcha-that-works';

function CaptchaTask({ active, complete }) {
  const recaptcha = useRef();

  const send = () => {
    recaptcha.current.open();
  };

  const close = () => {
    recaptcha.current.close();
  };

  const onVerify = (token) => {
    complete('reCaptcha');
    console.log('success!', token);
  };

  const onExpire = () => {
    console.warn('expired');
  };

  useEffect(() => {
    if (active == true) {
      send();
    }
  }, [active]);

  return (
    <View>
      <Recaptcha
        ref={recaptcha}
        siteKey="6Le7-FciAAAAACnKxo3JECtz17LYl2VjJgC17ydG"
        baseUrl="http://127.0.0.1"
        onVerify={onVerify}
        onExpire={onExpire}
        size="normal"
      />
    </View>
  );
}

export default CaptchaTask;

const styles = StyleSheet.create({});
