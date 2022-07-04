import React, { useEffect, useRef, useState } from 'react';
import { Alert, Platform, StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Appbar, Paragraph } from "react-native-paper";
import LoginForm from '../components/Login/LoginForm';
import { login } from '../src/api/usuario';
import { useMutation } from 'react-query';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
const axios = require('axios').default;
const initialValues = {
  email: '',
  password: '',
};

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

async function registerForPushNotificationsAsync() {
  let token;
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(`PushToken generado: ${token}`);
  } else {
    alert('Must use physical device for Push Notifications');
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;
}

export default function LoginScreen({ navigation }) {
  const responseListener = useRef();
  const [waitingServer, setWaitingServer] = useState(false);
  const { mutate, isLoading } = useMutation(login, {
    onSuccess: async (data) => {
      axios.defaults.headers.common.Authorization = `Bearer ${data.token}`;
      const expoPushToken = await registerForPushNotificationsAsync();
      const { email, esFamiliar } = data;
      await axios.patch(`/api/usuario`, { email, expoPushToken });
      if(esFamiliar) {
        navigation.navigate('FamiliarHome');
        return;
      }
      navigation.navigate('AppTabs', { esFamiliar });
    },
    onError: (error) => {
      Alert.alert('😞', error.response?.data?.message ?? 'Algo salió mal');
    },
    onSettled: () => {
      setWaitingServer(false);
    }
  });

  useEffect(() => {
    // registerForPushNotificationsAsync().then(token => {});
    // // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
    // responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
    //   // Acá va todo el código extra que tiene que correr cuando el usuario toca la notificación recibida:
    //   // navigation.navigate('Notificaciones');
    // });

    return () => {
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  async function handleLogin(credentials, actions) {
    setWaitingServer(true);
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
          loading={isLoading || waitingServer}
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
