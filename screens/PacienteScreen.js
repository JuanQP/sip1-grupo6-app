import React, { useCallback, useEffect, useState } from 'react'
import { StatusBar } from 'expo-status-bar';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import {
  Appbar,
  Avatar,
  Button,
  Title,
  withTheme
} from 'react-native-paper';
import { imagenes } from '../utils/utils';
import PacienteForm from '../components/Paciente/PacienteForm';
import FamiliaresList from '../components/Paciente/FamiliaresList';
import { useFocusEffect } from '@react-navigation/native';

const axios = require('axios').default;

function PacienteScreen({ navigation, route, ...props }) {

  const { colors } = props.theme;
  const [paciente, setPaciente] = useState({
    familiars: [],
    imagen: '',
  });

  function handleBackActionClick() {
    navigation.goBack();
  }

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        const { pacienteId } = route.params;
        const response = await axios.get(`/api/pacientes/${pacienteId}`);
        setPaciente({...response.data.paciente});
      }
      fetchData()
        .catch(console.error)
    }, [])
  );

  function handleNewFamiliar() {
    const { pacienteId } = route.params;
    navigation.navigate('FamiliarScreen', { pacienteId });
  }

  function handleEditFamiliar(familiar) {
    const { pacienteId } = route.params;
    navigation.navigate('FamiliarScreen',{
      pacienteId,
      familiarId: familiar.id
    });
  }

  return (
    <View style={{...styles.container, backgroundColor: colors.surface}}>
      <Appbar.Header>
        <Appbar.BackAction onPress={handleBackActionClick} />
        <Appbar.Content title="Mi Paciente" />
      </Appbar.Header>
      {/* Formulario */}
      <View style={styles.formContainer}>
        <ScrollView>
          <Avatar.Image
            style={{alignSelf: "center"}}
            size={64}
            source={imagenes[paciente.imagen]}
          />
          <PacienteForm
            pacienteId={route.params.pacienteId}
          />
          <View style={{ backgroundColor: colors.surface, marginTop: 20 }}>
            <Title style={{alignSelf: "center"}}>Familiares</Title>
            <FamiliaresList
              familiares={paciente.familiars}
              onEditFamiliar={handleEditFamiliar}
            />
            <Button
              mode='contained'
              onPress={handleNewFamiliar}
              icon="account-plus"
            >
              Agregar familiar
            </Button>
          </View>
        </ScrollView>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  formContainer: {
    padding: 20,
    marginBottom: 80,
    justifyContent: 'center',
  },
});

export default withTheme(PacienteScreen);
