import React, { useEffect, useState } from 'react'
import { StatusBar } from 'expo-status-bar';
import { Alert, FlatList, StyleSheet, View } from 'react-native';
import { Appbar, FAB, Portal, Text, withTheme } from 'react-native-paper';
import CalendarStrip from 'react-native-calendar-strip';
import { dateSort, formatearFecha, stringToMomentMarkedDate } from '../utils/utils';
import moment from 'moment';
import 'moment/locale/es';
import EstadoActividad from '../components/EstadoActividad';
import PacienteCard from '../components/PacienteCard';
import ActividadRow from '../components/ActividadRow';
import ActividadDetailsModal from '../components/ActividadDetailsModal';

const axios = require('axios').default;

const hoy = moment();
const fecha = formatearFecha(hoy);

function HomeScreen({ navigation, route, ...props }) {

  const [paciente, setPaciente] = useState(null);
  const [actividades, setActividades] = useState([]);
  const [fechaSeleccionada] = useState(moment());
  const [markedDates, setMarkedDates] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [actividadSeleccionada, setActividadSeleccionada] = useState(null);
  const [waitingResponse, setWaitingResponse] = useState(true);

  const { colors } = props.theme;

  const countEstadosActividades = actividades.reduce((acc, a) => {
    acc[a.estado]++;
    return acc;
  }, {completada: 0, pendiente: 0, pospuesta: 0});

  useEffect(() => {
    setWaitingResponse(true);
    const fetchData = async () => {
      const { pacienteId } = route.params;
      const pacienteResponse = await axios.get(`/api/pacientes/${pacienteId}`);
      const actividadesResponse = await axios.get(`/api/actividads/`, {
        params: { pacienteId },
      });
      setActividades(actividadesResponse.data.actividads.sort(dateSort));
      setPaciente(pacienteResponse.data.paciente);
      setWaitingResponse(false);
    }

    fetchData()
      .catch(console.error)
      .finally(() => setWaitingResponse(false));
  }, []);

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
    navigation.navigate("NuevaActividad", { pacienteId });
  }

  function handleActividadClick(actividad) {
    setActividadSeleccionada({...actividad});
    setModalVisible(true);
  }

  async function handleActividadModalSubmit(actividad) {
    try {
      await axios.patch(`/api/actividads/${actividad.id}`, actividad);
      const actividadesResponse = await axios.get(`/api/actividads/`, {
        params: { pacienteId: route.params.pacienteId },
      });
      setActividades(actividadesResponse.data.actividads.sort(dateSort));
      hideModal();
    } catch (error) {
      console.log(error);
      Alert.alert("😞", "No se pudo actualizar esta actividad");
    }
  }

  function handlePacienteDetailButtonClick() {
    const { pacienteId } = route.params;
    navigation.navigate('PacienteDetail', { pacienteId });
  }

  if(waitingResponse || paciente === null) {
    return null;
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
      {/* Lista de actividades agendadas */}
      <FlatList
        data={actividades}
        renderItem={({ item }) =>
          <ActividadRow
            onActividadClick={handleActividadClick}
            actividad={item}
          />
        }
        keyExtractor={actividad => actividad.id}
      />
      {/* Botón flotante */}
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={handleNuevaActividadClick}
      />
      <Portal>
        <ActividadDetailsModal
          actividad={actividadSeleccionada}
          visible={modalVisible}
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
