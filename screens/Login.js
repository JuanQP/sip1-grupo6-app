import React, { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Appbar, Paragraph } from "react-native-paper";
import LoginForm from '../components/Login/LoginForm';

const axios = require('axios').default;

export default function LoginScreen({ navigation }) {

  const [waitingResponse, setWaitingResponse] = useState(false);
  const initialValues = {
    email: '',
    password: '',
  };

  async function handleLogin(credentials, actions) {
    const { email, password } = credentials;
    setWaitingResponse(true);
    try {
      await axios.post('/api/login', {email, password});
      actions.setValues(initialValues, false);
      navigation.navigate('MisPacientes', { pacienteId: null });
    } catch ({ response }) {
      Alert.alert('', response.data.errors[0]);
      actions.setValues({
        ...initialValues,
        email,
      }, false);
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
        <LoginForm
          initialValues={initialValues}
          loading={waitingResponse}
          onSubmit={handleLogin}
        />
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
