import React, { useEffect, useState } from 'react'
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { Appbar, Button, withTheme } from 'react-native-paper';
import 'moment/locale/es';
import PacienteList from '../components/MisPacientes/PacienteList';
const axios = require('axios').default;

function MisPacientesScreen({ navigation, route }) {

  const [waitingResponse, setWaitingResponse] = useState(true);
  const [pacientes, setPacientes] = useState([]);
  const { pacienteId } = route.params;

  useEffect(() => {
    setWaitingResponse(true);
    const fetchData = async () => {
      const response = await axios.get('/api/pacientes');
      setPacientes(response.data.pacientes);
      setWaitingResponse(false);
    }
    fetchData()
      .catch(console.error)
      .finally(() => setWaitingResponse(false));
  }, []);

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
      {waitingResponse ?
        null :
        <PacienteList
          selectedId={pacienteId}
          pacientes={pacientes}
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
