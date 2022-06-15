import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Text } from "react-native-paper";
import moment from 'moment';

function NotificacionCard({ notificacion, style }) {
  const fecha = moment(notificacion.fecha).format('DD/MM/YYYY HH:mm');

  return (
    <Card style={style}>
      <Card.Content>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text>Actividad Pospuesta</Text>
          <Text style={styles.grayText}>{fecha}</Text>
        </View>
        <Text style={styles.grayText}>Nombre: {notificacion.nombre}</Text>
        <Text style={styles.grayText}>Razón: "{notificacion.razon}"</Text>
      </Card.Content>
    </Card>
  )
}

const styles = StyleSheet.create({
  grayText: {
    color: '#4c5454'
  }
});

export default NotificacionCard;
