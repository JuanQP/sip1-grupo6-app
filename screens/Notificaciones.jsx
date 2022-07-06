import React from 'react'
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { Appbar, withTheme } from 'react-native-paper';
import 'moment/locale/es';
import { useQuery } from 'react-query';
import { getNotificaciones } from '../src/api/notificacion';
import NotificacionCard from '../components/Notificaciones/NotificacionCard';
import { useState } from 'react';
import { useEffect } from 'react';

function NotificacionesScreen({ navigation, route, ...props }) {

  const [notificaciones, setNotificaciones] = useState([]);

  useEffect(() => {
    getNotificaciones()
    .then((res) => setNotificaciones(res))
    .catch((err) => console.error(err))

    return () => {
      setNotificaciones([]);
    }
  }, []);

  function handleBackClick() {
    navigation.navigate('FamiliarHome');
  }

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Action icon="arrow-left" onPress={handleBackClick} />
        <Appbar.Content title="Notificaciones" />
      </Appbar.Header>
      <View style={{ marginHorizontal: 10 }}>
        {notificaciones && notificaciones.map((notificacion, i) => (
          <NotificacionCard
            key={i}
            notificacion={notificacion}
            style={{ marginVertical: 5 }}
          />
        ))}
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default withTheme(NotificacionesScreen);
