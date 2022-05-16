import React, { useRef, useState } from 'react'
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { Appbar, Button, IconButton, Surface, Text, TextInput, Title, withTheme } from 'react-native-paper';
import 'moment/locale/es';

const categoriaList = [
  {
    label: 'Medicación',
    value: 'medicacion',
  },
  {
    label: 'Consulta Médica',
    value: 'consulta-medica',
  },
  {
    label: 'Estudio Médico',
    value: 'estudio-medico',
  },
  {
    label: 'Otra',
    value: 'otra',
  },
]

function NuevaActividadScreen({ navigation, ...props }) {

  const { colors } = props.theme;

  function handleBackActionClick() {
    navigation.goBack();
  }

  function handleNuevaMedicacion() {
    navigation.navigate('NuevaActividadMedicacion');
  }

  function handleNuevaConsulta() {
    navigation.navigate('NuevaActividadConsulta');
  }

  function handleNuevoEstudio() {
    navigation.navigate('NuevaActividadEstudio');
  }

  function handleNuevoOtro() {
    navigation.navigate('NuevaActividadOtro');
  }

  return (
    <View style={{...styles.container, backgroundColor: colors.surface}}>
      <Appbar.Header>
        <Appbar.BackAction onPress={handleBackActionClick} />
        <Appbar.Content title="Tipo de Actividad" />
      </Appbar.Header>
      {/* Formulario */}
      <View style={styles.cardsContainer}>
        <View style={styles.row}>
          <Surface style={styles.card} onTouchStart={handleNuevaMedicacion}>
            <Text>Medicación</Text>
            <IconButton color={colors.primary} icon="pill" />
          </Surface>
          <Surface style={styles.card} onTouchStart={handleNuevaConsulta}>
            <Text>Consulta Médica</Text>
            <IconButton color={colors.primary} icon="doctor" />
          </Surface>
        </View>
        <View style={styles.row}>
          <Surface style={styles.card} onTouchStart={handleNuevoEstudio}>
            <Text>Estudio Médico</Text>
            <IconButton color={colors.primary} icon="hospital-building" />
          </Surface>
          <Surface style={styles.card} onTouchStart={handleNuevoOtro}>
            <Text>Otro</Text>
            <IconButton color={colors.primary} icon="dots-horizontal" />
          </Surface>
        </View>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
  },
  card: {
    height: 100,
    margin: 10,
    elevation: 4,
    flex: 1,
    alignItems: "center",
    justifyContent: 'center',
  },
  cardsContainer: {
    padding: 20,
  },
});

export default withTheme(NuevaActividadScreen);
