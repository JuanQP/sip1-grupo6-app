import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { Alert, StyleSheet, View } from "react-native";
import { Portal, Subheading, Surface, useTheme } from "react-native-paper";
import { useMutation, useQuery, useQueryClient } from 'react-query';
import ActividadDetailsModal from '../components/Home/ActividadDetailsModal';
import ActividadesList from '../components/Home/ActividadesList';
import NavbarLayout from '../layouts/NavbarLayout';
import { updateActividad } from '../src/api/actividad';
import { getMiSemana } from '../src/api/usuario';
import EstadoActividad from '../components/Home/EstadoActividad';
import moment from "moment";

const pantallasActividades = {
  'Medicación': 'Medicacion',
  'Consulta Médica': 'Consulta',
  'Estudio Médico': 'Estudio',
  'Otro': 'Otro',
};

function OverviewScreen({ navigation }) {
  const { colors } = useTheme();
  const queryClient = useQueryClient();
  const inicioSemana = moment().startOf('isoWeek').format('DD/MM/YYYY');
  const finSemana = moment().endOf('isoWeek').format('DD/MM/YYYY');
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
    <NavbarLayout title="Mi Semana">
      <Surface style={{paddingVertical: 5}}>
        <View style={{alignItems: 'center'}}>
          <Subheading>
            Semana del
            <Subheading style={{fontWeight: 'bold'}}>
              {` ${inicioSemana} `}
            </Subheading>
            al
            <Subheading style={{fontWeight: 'bold'}}>
              {` ${finSemana} `}
            </Subheading>
          </Subheading>
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
          <EstadoActividad
            titulo={'Completadas'}
            actividades={actividades}
            color={colors.completada}
          />
          <EstadoActividad
            titulo={'Pendientes'}
            actividades={actividades}
            color={colors.pendiente}
          />
          <EstadoActividad
            titulo={'Pospuestas'}
            actividades={actividades}
            color={colors.pospuesta}
          />
        </View>
      </Surface>
      <View style={styles.container}>
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
