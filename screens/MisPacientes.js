import React from 'react'
import { StatusBar } from 'expo-status-bar';
import { Alert, StyleSheet, View } from 'react-native';
import { Appbar, Button, List } from 'react-native-paper';
import 'moment/locale/es';
import PacienteItem from '../components/PacienteItem';

const pacientes = [
  {
    id: 1,
    nombre: 'Mirta Pérez',
    ubicacion: 'Tigre, Buenos Aires',
    imagen: require('../assets/mirta.png'),
  },
  {
    id: 2,
    nombre: 'András Arató',
    ubicacion: 'Budapest, Hungría',
    imagen: require('../assets/andras.png'),
  }
];

export default function MisPacientesScreen({ navigation }) {

  function handleBackActionClick() {
    navigation.goBack();
  }

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={handleBackActionClick} />
        <Appbar.Content title="Mis Pacientes" />
      </Appbar.Header>
      {/* Lista de pacientes */}
      <List.Section style={styles.listaPacientes}>
        {pacientes.map(p => <PacienteItem key={p.id} paciente={p} />)}
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
  listaPacientes: {
    backgroundColor: 'white',
  },
});
