import React from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Appbar, Paragraph } from "react-native-paper";
import LoginForm from '../components/Login/LoginForm';
import { login } from '../src/api/usuario';
import { useMutation } from 'react-query';
const axios = require('axios').default;
const initialValues = {
  email: '',
  password: '',
};

export default function LoginScreen({ navigation }) {
  const { mutate, isLoading } = useMutation(login, {
    onSuccess: (data) => {
      axios.defaults.headers.common.Authorization = `Bearer ${data.token}`;
      navigation.navigate('MisPacientes');
    },
    onError: (error) => {
      Alert.alert('😞', error.response?.data?.message ?? 'Algo salió mal');
    },
  });

  async function handleLogin(credentials, actions) {
    actions.setFieldValue('password', '');
    mutate(credentials);
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
          loading={isLoading}
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
