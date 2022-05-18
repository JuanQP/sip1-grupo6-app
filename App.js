import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import App from './src/App';
import moment from 'moment';
import { crearServer } from './dev-server/server.js'
moment.locale("es");

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#07ACB9',
    accent: '#a53364',
    pendiente: '#ffeb6a',
    pospuesta: '#f87575',
  }
}

const dev = true;

window.server = dev ? crearServer() : null;

export default function Main() {
  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <App />
      </NavigationContainer>
    </PaperProvider>
  );
}
