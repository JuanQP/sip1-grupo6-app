import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import App from './src/App';
import moment from 'moment';
import { crearServer } from './dev-server/server.js';
import { QueryClient, QueryClientProvider } from 'react-query';
moment.locale("es");

const queryClient = new QueryClient();
const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#07ACB9',
    accent: '#a53364',
    completada: '#50d2c2',
    pendiente: '#fadb02',
    pospuesta: '#f87575',
    disabled: '#6f6f6f',
  }
}

const dev = true;

window.server = dev ? crearServer() : null;

export default function Main() {
  return (
    <QueryClientProvider client={queryClient}>
      <PaperProvider theme={theme}>
        <NavigationContainer>
          <App />
        </NavigationContainer>
      </PaperProvider>
    </QueryClientProvider>
  );
}
