import React from 'react'
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { Appbar, Button, withTheme } from 'react-native-paper';
import 'moment/locale/es';
import PacienteList from '../components/MisPacientes/PacienteList';
import { useQuery } from 'react-query';
import { getPacientes } from '../src/api/paciente';
const axios = require('axios').default;

function MisPacientesScreen({ navigation, route }) {
  const { data, isLoading } = useQuery('pacientes', getPacientes, {
    placeholderData: {
      pacientes: [],
    },
  });
  const { pacienteId } = route?.params?.pacienteId ?? { pacienteId: null };

  function handleBackActionClick() {
    navigation.goBack();
  }

  function handlePacienteClick(pacienteId) {
    navigation.navigate('Home', { pacienteId });
  }

  function handleAgregarPacienteClick() {
    navigation.navigate('NuevoPaciente');
  }

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={handleBackActionClick} />
        <Appbar.Content title="Mis Pacientes" />
      </Appbar.Header>
      {/* Lista de pacientes */}
      {isLoading ?
        null :
        <PacienteList
          selectedId={pacienteId}
          pacientes={data.pacientes}
          onPacienteClick={handlePacienteClick}
        />
      }
      <Button
        mode="contained"
        onPress={handleAgregarPacienteClick}
      >
        Agregar Paciente
      </Button>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default withTheme(MisPacientesScreen);
