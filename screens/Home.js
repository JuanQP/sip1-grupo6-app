import React, { useCallback, useEffect, useState } from 'react'
import { StatusBar } from 'expo-status-bar';
import { Alert, StyleSheet, View } from 'react-native';
import { Appbar, FAB, Portal, Text, withTheme } from 'react-native-paper';
import CalendarStrip from 'react-native-calendar-strip';
import { dateSort, formatearFecha, stringToMomentMarkedDate } from '../utils/utils';
import moment from 'moment';
import 'moment/locale/es';
import EstadoActividad from '../components/Home/EstadoActividad';
import PacienteCard from '../components/Home/PacienteCard';
import ActividadDetailsModal from '../components/Home/ActividadDetailsModal';
import { useFocusEffect } from '@react-navigation/native';
import ActividadesList from '../components/Home/ActividadesList';

const axios = require('axios').default;

const hoy = moment();
const fecha = formatearFecha(hoy);

const pantallasActividades = {
  'Medicación': 'Medicacion',
  'Consulta Médica': 'Consulta',
  'Estudio Médico': 'Estudio',
  'Otro': 'Otro',
};

function HomeScreen({ navigation, route, ...props }) {

  const [paciente, setPaciente] = useState(null);
  const [actividades, setActividades] = useState([]);
  const [fechaSeleccionada] = useState(moment());
  const [markedDates, setMarkedDates] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [actividadSeleccionada, setActividadSeleccionada] = useState(null);
  const [waitingResponse, setWaitingResponse] = useState(true);
  const [waitingActividadResponse, setWaitingActividadResponse] = useState(false);

  const { colors } = props.theme;

  const countEstadosActividades = actividades.reduce((acc, a) => {
    acc[a.estado]++;
    return acc;
  }, {completada: 0, pendiente: 0, pospuesta: 0});


  useFocusEffect(
    useCallback(() => {
      setWaitingResponse(true);
      const fetchData = async () => {
        const { pacienteId } = route.params;
        const [pacienteResponse, actividadesResponse] = await Promise.all([
          axios.get(`/api/pacientes/${pacienteId}`),
          axios.get(`/api/actividads/`, {params: { pacienteId }}),
        ]);
        setActividades(actividadesResponse.data.actividads.sort(dateSort));
        setPaciente(pacienteResponse.data.paciente);
        setWaitingResponse(false);
      }

      fetchData()
        .catch(console.error)
        .finally(() => setWaitingResponse(false));
    }, [])
  );

  useEffect(() => {
    const newMarkedDates = actividades.map(a => stringToMomentMarkedDate(a.fecha, colors));
    setMarkedDates(newMarkedDates);
  }, [actividades]);

  function hideModal() {
    setModalVisible(false);
  }

  function proximamenteAlert() {
    Alert.alert("Próximamente...", "😁");
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
    try {
      setWaitingActividadResponse(true);
      await axios.patch(`/api/actividads/${actividad.id}`, {
        estado: actividad.estado,
      });
      const actividadesResponse = await axios.get(`/api/actividads/`, {
        params: { pacienteId: route.params.pacienteId },
      });
      setActividades(actividadesResponse.data.actividads.sort(dateSort));
      hideModal();
    } catch (error) {
      console.log(error);
      Alert.alert("😞", "No se pudo actualizar esta actividad");
    }
    finally {
      setWaitingActividadResponse(false);
    }
  }

  function handlePacienteDetailButtonClick() {
    const { pacienteId } = route.params;
    navigation.navigate('PacienteDetail', { pacienteId });
  }

  function handleActividadEditClick(actividadId) {
    const { pacienteId } = route.params;
    const actividad = actividades.find(a => a.id === actividadId);
    const proximaPantalla = pantallasActividades[actividad.tipo];
    setModalVisible(false);
    navigation.navigate(proximaPantalla, { pacienteId, actividadId });
  }

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Action icon="menu" onPress={proximamenteAlert} />
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
          cantidad={countEstadosActividades.completada}
          color={colors.primary}
        />
        <EstadoActividad
          titulo={'PENDIENTES'}
          cantidad={countEstadosActividades.pendiente}
          color={colors.pendiente}
        />
        <EstadoActividad
          titulo={'POSPUESTAS'}
          cantidad={countEstadosActividades.pospuesta}
          color={colors.pospuesta}
        />
      </View>
      {/* Date picker */}
      <CalendarStrip
        scrollable
        style={{height: 70, marginTop: 10}}
        calendarColor={colors.surface}
        iconContainer={{flex: 0.1}}
        selectedDate={fechaSeleccionada}
        highlightDateContainerStyle={{ backgroundColor: colors.primary }}
        highlightDateNumberStyle={{color: colors.surface}}
        highlightDateNameStyle={{color: colors.surface}}
        markedDates={markedDates}
        showMonth={false}
      />
      <ActividadesList
        actividades={actividades}
        onActividadClick={handleActividadClick}
      />
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={handleNuevaActividadClick}
      />
      <Portal>
        <ActividadDetailsModal
          actividad={actividadSeleccionada}
          visible={modalVisible}
          waiting={waitingActividadResponse}
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
