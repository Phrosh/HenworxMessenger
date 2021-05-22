import React, {useCallback, useState} from 'react';
import {SafeAreaView, StatusBar, useColorScheme} from 'react-native';
import RNSimpleCrypto from 'react-native-simple-crypto';
import axios from 'axios';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import {
  IconButton,
  Provider as PaperProvider,
  Snackbar,
  TextInput,
} from 'react-native-paper';
import {Container, TextInputPanel} from './style';

const PUBLIC_KEY = `-----BEGIN RSA PUBLIC KEY-----
MIIBCgKCAQEArOI1m8foqo8fjvWTUYLr5V5ivjIA/uh588ynkHIWOYTR8AGvMsSz
x2NWwpa2Q/ZiJnOm3FBaK2FYKa5vKGvEZXZV41q1w+qpS6Z+KF+MSBWS7UGNJXE0
efn5VdFRIJjLcv5p0bkrROeKoRuV5VDDuV9N2RY0/T99fLTAd3bm67a3/kmPlI8C
RAtG0SfHUIOsXeTcw8h5FMvr4lniSOYVEjd55xobYuocxz+/Jpm7dcpdZOtO5O+X
yNkN6ubo3gpBwXrdErX++wsEr5OAqxUDCfdWh810+6ksxLhQcexTrlcY4KH2kqi3
Vu5IBQaWCgQjORqiiRR31deBuz++VHINwQIDAQAB
-----END RSA PUBLIC KEY-----
`;
const API_URL = 'https://sf07lstba0.execute-api.eu-west-1.amazonaws.com/prod/';

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const [text, setText] = useState('');
  const [loading, setLoading] = useState([]);
  const [error, setError] = useState();

  // RSA-encrypt message and send it to the server
  const sendEncryptedMessage = useCallback(() => {
    setLoading(old => [...old, 'sending']);
    setError(null);

    // encrypt message
    RNSimpleCrypto.RSA.encrypt(text, PUBLIC_KEY)
      .then(result => {
        // send encrypted message to server
        axios
          .post(`${API_URL}henworx`, {text: result})
          .finally(() => {
            setText('');
            setLoading(old => old.filter(x => x !== 'sending'));
          })
          .catch(e => {
            // api call failed
            console.log(e);
            setError('API call failed');
            setLoading(old => old.filter(x => x !== 'sending'));
          });
      })
      .catch(e => {
        // encryption failed
        console.log(e);
        setError('failed to encrypt the message');
        setLoading(old => old.filter(x => x !== 'sending'));
      });
  }, [text]);

  return (
    <PaperProvider>
      <SafeAreaView style={backgroundStyle}>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <Container>
          <TextInputPanel>
            <TextInput
              value={text}
              disabled={loading.find(x => x === 'sending')}
              mode="outlined"
              label="Text"
              style={{flex: 1, marginRight: 10}}
              onChangeText={setText}
            />
            <IconButton
              mode="outlined"
              icon="send"
              onPress={sendEncryptedMessage}
              disabled={
                !text ||
                text.trim().length === 0 ||
                loading.find(x => x === 'sending')
              }
            />
          </TextInputPanel>
        </Container>
        {/* show errors */}
        <Snackbar visible={error} onDismiss={() => setError(null)}>
          {error}
        </Snackbar>
      </SafeAreaView>
    </PaperProvider>
  );
};

export default App;
