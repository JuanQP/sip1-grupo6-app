import React, { useEffect, useState } from 'react'
import { StatusBar } from 'expo-status-bar';
import { Alert, StyleSheet, View } from 'react-native';
import { Appbar, Button, List, withTheme } from 'react-native-paper';
import 'moment/locale/es';
import PacienteItem from '../components/PacienteItem';
const axios = require('axios').default;

function MisPacientesScreen({ navigation, route, ...props }) {

  const [waitingResponse, setWaitingResponse] = useState(true);
  const [pacientes, setPacientes] = useState([]);
  const seleccionado = route.params.pacienteId;

  const { colors } = props.theme;

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

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={handleBackActionClick} />
        <Appbar.Content title="Mis Pacientes" />
      </Appbar.Header>
      {/* Lista de pacientes */}
      <List.Section style={{ backgroundColor: colors.surface }}>
        {waitingResponse ?
          <List.Item
            title="Cargando..."
          />
        : pacientes.map(p =>
          <PacienteItem
            key={p.id}
            paciente={p}
            isSelected={p.id === seleccionado}
            onPacienteClick={handlePacienteClick}
          />
        )}
      </List.Section>
      <Button
        mode="contained"
        onPress={() => Alert.alert("😳", "Nada por aquí...")}
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
