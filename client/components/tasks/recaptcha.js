import { StatusBar } from 'expo-status-bar';
import React, { useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
} from 'react-native';

import Recaptcha from 'react-native-recaptcha-that-works';

function CaptchaTask(props) {
    const recaptcha = useRef();
    
    const send = () => {
        console.log('send!');
        recaptcha.current.open();
    }

    const onVerify = token => {
        props.complete('reCaptcha');
        console.log('success!', token);
    }

    const onExpire = () => {
        console.warn('expired');
    }

    useEffect(() => {
      if(props.active == true){
        send();
      }
    }, [props.active]);

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

const styles = StyleSheet.create({

});
