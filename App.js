import React from 'react';
import {SafeAreaView, StatusBar, useColorScheme} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import {
  IconButton,
  Provider as PaperProvider,
  TextInput,
} from 'react-native-paper';
import {Container, TextInputPanel} from './style';

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <PaperProvider>
      <SafeAreaView style={backgroundStyle}>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <Container>
          <TextInputPanel style={{}}>
            <TextInput
              mode="outlined"
              label="Text"
              style={{flex: 1, marginRight: 10}}
            />
            <IconButton mode="outlined" icon="send" />
          </TextInputPanel>
        </Container>
      </SafeAreaView>
    </PaperProvider>
  );
};

export default App;
