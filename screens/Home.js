import React, { useState } from 'react'
import { StatusBar } from 'expo-status-bar';
import { Alert, StyleSheet, View } from 'react-native';
import { Appbar, FAB, Portal, Text, withTheme } from 'react-native-paper';
import { formatearFecha, stringToMomentMarkedDate } from '../utils/utils';
import moment from 'moment';
import 'moment/locale/es';
import EstadoActividad from '../components/Home/EstadoActividad';
import PacienteCard from '../components/Home/PacienteCard';
import ActividadDetailsModal from '../components/Home/ActividadDetailsModal';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { getPaciente, getPacienteActividades } from '../src/api/paciente';
import { updateActividad } from '../src/api/actividad';
import Calendario from '../components/Actividades/Calendario';

const hoy = moment();
const fecha = formatearFecha(hoy);
const pantallasActividades = {
  'Medicación': 'Medicacion',
  'Consulta Médica': 'Consulta',
  'Estudio Médico': 'Estudio',
  'Otro': 'Otro',
};

function HomeScreen({ navigation, route, ...props }) {
  const { pacienteId } = route.params;
  const queryClient = useQueryClient();
  const { data: paciente } = useQuery('paciente',
    () => getPaciente(pacienteId),
    { placeholderData: null }
  );
  const { data: actividades } = useQuery('actividades',
    () => getPacienteActividades(pacienteId),
    {
      placeholderData: [],
      onSuccess: (data) => {
        const newMarkedDates = data.map(a => stringToMomentMarkedDate(a.fecha, colors));
        setMarkedDates(newMarkedDates);
      },
    },
  );
  const { mutate: actividadMutate, actividadIsLoading } = useMutation(
    updateActividad,
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['actividades']);
        hideModal();
      },
      onError: () => Alert.alert("😞", "No se pudo actualizar esta actividad"),
    },
  );
  const [fechaSeleccionada] = useState(moment());
  const [markedDates, setMarkedDates] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [actividadSeleccionada, setActividadSeleccionada] = useState(null);
  const { colors } = props.theme;

  function hideModal() {
    setModalVisible(false);
  }

  function handleHomeClick() {
    navigation.navigate("Overview");
  }

  function onMisPacientesClick() {
    const { pacienteId } = route.params;
    navigation.navigate("MisPacientes", { pacienteId });
  }

  function handleNuevaActividadClick() {
    const { pacienteId } = route.params;
    navigation.navigate("Actividad", { pacienteId });
  }

  function handleActividadClick(actividad) {
    setActividadSeleccionada({...actividad});
    setModalVisible(true);
  }

  async function handleActividadModalSubmit(actividad) {
    actividadMutate({
      id: actividad.id,
      estado: actividad.estado,
      nota: actividad.nota,
    });
  }

  function handlePacienteDetailButtonClick() {
    const { pacienteId } = route.params;
    navigation.navigate('Paciente', { pacienteId });
  }

  function handleActividadEditClick(actividad) {
    const { pacienteId } = route.params;
    const proximaPantalla = pantallasActividades[actividad.tipo];
    setModalVisible(false);
    navigation.navigate(proximaPantalla, { pacienteId, actividadId: actividad.id });
  }

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Action icon="home" onPress={handleHomeClick} />
        <Appbar.Content title="Actividades" />
        <Appbar.Action icon="account-group" onPress={onMisPacientesClick} />
      </Appbar.Header>
      <PacienteCard
        paciente={paciente}
        onPacienteDetailClick={handlePacienteDetailButtonClick}
      />
      <Text style={{margin: 10, alignSelf: 'center'}}>
        {fecha}
      </Text>
      <View style={styles.containerEstadosActividades}>
        <EstadoActividad
          titulo={'COMPLETADAS'}
          actividades={actividades}
          color={colors.completada}
        />
        <EstadoActividad
          titulo={'PENDIENTES'}
          actividades={actividades}
          color={colors.pendiente}
        />
        <EstadoActividad
          titulo={'POSPUESTAS'}
          actividades={actividades}
          color={colors.pospuesta}
        />
      </View>
      {/* Date picker */}
      <View style={{flex: 1}}>
        <Calendario 
          actividades={actividades}
          onActividadClick={handleActividadClick}
        />
      </View>
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={handleNuevaActividadClick}
      />
      <Portal>
        <ActividadDetailsModal
          actividad={actividadSeleccionada}
          visible={modalVisible}
          waiting={actividadIsLoading}
          readOnly={false}
          onEditClick={handleActividadEditClick}
          onDismiss={hideModal}
          onSubmit={handleActividadModalSubmit}
        />
      </Portal>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  containerEstadosActividades: {
    marginHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
});

export default withTheme(HomeScreen);
