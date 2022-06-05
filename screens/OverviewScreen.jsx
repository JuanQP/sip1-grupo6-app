import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { Alert, StyleSheet, View } from "react-native";
import { Portal, Text, Title } from "react-native-paper";
import { useMutation, useQuery, useQueryClient } from 'react-query';
import ActividadDetailsModal from '../components/Home/ActividadDetailsModal';
import ActividadesList from '../components/Home/ActividadesList';
import NavbarLayout from '../layouts/NavbarLayout';
import { updateActividad } from '../src/api/actividad';
import { getMiSemana } from '../src/api/usuario';

const pantallasActividades = {
  'Medicación': 'Medicacion',
  'Consulta Médica': 'Consulta',
  'Estudio Médico': 'Estudio',
  'Otro': 'Otro',
};

function OverviewScreen({ navigation }) {
  const queryClient = useQueryClient();
  const { data: actividades,  } = useQuery('mi-semana', getMiSemana, {
    placeholderData: [],
  });
  const { mutate: actividadMutate, actividadIsLoading } = useMutation(
    updateActividad,
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['mi-semana']);
        hideModal();
      },
      onError: () => Alert.alert("😞", "No se pudo actualizar esta actividad"),
    },
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [actividadSeleccionada, setActividadSeleccionada] = useState(null);

  function hideModal() {
    setModalVisible(false);
  }

  function handleActividadClick(actividad) {
    setActividadSeleccionada({...actividad});
    setModalVisible(true);
  }

  function handleMisPacientesPress() {
    navigation.navigate('MisPacientes');
  } 

  async function handleActividadModalSubmit(actividad) {
    actividadMutate({
      id: actividad.id,
      estado: actividad.estado,
    });
  }

  useFocusEffect(
    useCallback(() => {
      queryClient.invalidateQueries(['mi-semana']);
    }, [])
  );

  function handleActividadEditClick(actividad) {
    const { pacienteId, id: actividadId, tipo } = actividad;
    const proximaPantalla = pantallasActividades[tipo];
    setModalVisible(false);
    navigation.navigate(proximaPantalla, { pacienteId, actividadId });
  }

  return (
    <NavbarLayout
      title="Home"
      onMisPacientesPress={handleMisPacientesPress}
    >
      <View style={styles.container}>
        <Title>Mi semana</Title>
        <Text>Actividades de todos los pacientes para esta semana</Text>
        <ActividadesList
          actividades={actividades}
          onActividadClick={handleActividadClick}
          mostrarPaciente
        />
        <Portal>
          <ActividadDetailsModal
            actividad={actividadSeleccionada}
            visible={modalVisible}
            waiting={actividadIsLoading}
            mostrarPaciente
            onEditClick={handleActividadEditClick}
            onDismiss={hideModal}
            onSubmit={handleActividadModalSubmit}
          />
        </Portal>
      </View>
    </NavbarLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flex: 1,
  },
});

export default OverviewScreen;
