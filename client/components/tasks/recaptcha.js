import { StatusBar } from 'expo-status-bar';
import React, { useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';

import Recaptcha from 'react-native-recaptcha-that-works';

function CaptchaTask({ active, complete, closeTask }) {
  const recaptcha = useRef();

  const send = () => {
    recaptcha.current.open();
  };

  const close = () => {
    recaptcha.current.close();
  };

  const onVerify = (token) => {
    complete('reCaptcha');
    console.log(`reCaptcha success! token: ${token.substring(0, 8)}`);
  };

  const onExpire = () => {
    console.warn('expired');
  };

  useEffect(() => {
    if (active == true) {
      send();
    } else {
      close();
    }
  }, [active]);

  return (
    <View>
      <Recaptcha
        ref={recaptcha}
        siteKey="6Le7-FciAAAAACnKxo3JECtz17LYl2VjJgC17ydG"
        baseUrl="http://127.0.0.1"
        footerComponent={
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => {
              close;
              closeTask('reCaptcha');
            }}
          >
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        }
        onVerify={onVerify}
        onExpire={onExpire}
        size="normal"
      />
    </View>
  );
}

export default CaptchaTask;

const styles = StyleSheet.create({
  closeButton: {
    backgroundColor: 'blue',
    height: 50,
    alignItems: 'center',
    padding: 10,
  },
  closeText: {
    fontSize: 40,
    fontFamily: 'Impostograph-Regular',
  },
});
