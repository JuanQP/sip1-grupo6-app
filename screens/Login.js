import { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Appbar, Paragraph } from "react-native-paper";
import LoginForm from '../components/Login/LoginForm';

const axios = require('axios').default;

export default function LoginScreen({ navigation }) {

  const [waitingResponse, setWaitingResponse] = useState(false);

  async function handleLogin(credentials) {
    const { email, password } = credentials;
    setWaitingResponse(true);
    try {
      await axios.post('/api/login', {email, password});
      navigation.navigate('MisPacientes', { pacienteId: null });
    } catch ({ response }) {
      Alert.alert('', response.data.errors[0]);
    }
    finally {
      setWaitingResponse(false);
    }
  }

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="Login" />
      </Appbar.Header>
      <View style={styles.loginView}>
        <Paragraph>
          ¡Bienvenido 😄!
        </Paragraph>
        <LoginForm loading={waitingResponse} onSubmit={handleLogin}/>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loginView: {
    padding: 32,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
});
