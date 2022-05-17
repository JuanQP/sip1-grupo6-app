import React, { useEffect, useState } from 'react'
import { StatusBar } from 'expo-status-bar';
import { Alert, FlatList, StyleSheet, View } from 'react-native';
import { Appbar, FAB, Portal, Text, withTheme } from 'react-native-paper';
import CalendarStrip from 'react-native-calendar-strip';
import { formatearFecha, momentRange, momentToMarkedDate } from '../utils/utils';
import moment from 'moment';
import 'moment/locale/es';
import EstadoActividad from '../components/EstadoActividad';
import PacienteCard from '../components/PacienteCard';
import ActividadRow from '../components/ActividadRow';
import ActividadDetailsModal from '../components/ActividadDetailsModal';

const hoy = moment();
const fecha = formatearFecha(hoy);

// Data del paciente
const paciente = {
  nombre: 'Mirta Pérez',
  edad: 82,
  ubicacion: 'Tigre, Buenos Aires',
  obraSocial: 'Swiss Medical',
  numeroObraSocial: '12567810901',
  imagen: require('../assets/mirta.png'),
};
// Data de las actividades agendadas
const actividades = [
  {
    id: 1,
    fecha: hoy.clone().set({hour: 16, minute: 0}),
    descripcion: "Consulta con el cardiólogo",
    observaciones: "Morbi nec velit dolor. Aenean ut elit libero. Lorem ipsum.",
    estado: 'completada',
  },
  {
    id: 2,
    fecha: hoy.clone().set({hour: 17, minute: 0}),
    descripcion: "Enalapril",
    observaciones: "amet dictum sit amet justo donec enim diam vulputate ut",
    estado: 'pendiente',
  },
  {
    id: 3,
    fecha: hoy.clone().set({hour: 17, minute: 30}),
    descripcion: "Diurex",
    observaciones: 'viverra vitae congue eu consequat ac felis donec et odio pellentesque diam volutpat commodo sed',
    estado: 'pendiente',
  },
  {
    id: 4,
    fecha: hoy.clone().add(1, "days").set({hour: 8, minute: 30}),
    descripcion: "Aricept",
    observaciones: 'elementum tempus egestas sed sed risus pretium quam vulputate dignissim',
    estado: 'pendiente',
  },
  {
    id: 5,
    fecha: hoy.clone().add(1, "days").set({hour: 9, minute: 0}),
    descripcion: "Multivitamínico",
    observaciones: 'mauris pharetra et ultrices neque ornare aenean euismod elementum nisi',
    estado: 'pendiente',
  },
  {
    id: 6,
    fecha: hoy.clone().add(1, "days").set({hour: 17, minute: 0}),
    descripcion: "Enalapril",
    observaciones: 'nibh venenatis cras sed felis eget velit aliquet sagittis id',
    estado: 'pendiente',
  },
  {
    id: 7,
    fecha: hoy.clone().add(1, "days").set({hour: 17, minute: 30}),
    descripcion: "Diurex",
    observaciones: 'proin nibh nisl condimentum id venenatis a condimentum vitae sapien',
    estado: 'pendiente',
  },
];

function HomeScreen({ navigation, ...props }) {

  const [fechaSeleccionada] = useState(moment());
  const [markedDates, setMarkedDates] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [actividadSeleccionada, setActividadSeleccionada] = useState(null);

  const { colors } = props.theme;

  useEffect(() => {
    const fecha_inicio = hoy.clone().subtract(3, "days");
    const fecha_fin = hoy.clone().add(4, "days");
    const fechas = momentRange(fecha_inicio, fecha_fin);

    setMarkedDates(fechas.map((f) => momentToMarkedDate(f, colors)));
  }, []);

  function hideModal() {
    setModalVisible(false);
  }

  function proximamenteAlert() {
    Alert.alert("Próximamente...", "😁");
  }

  function onMisPacientesClick() {
    navigation.navigate("MisPacientes");
  }

  function handleNuevaActividadClick() {
    navigation.navigate("NuevaActividad");
  }

  function handleActividadClick(actividad) {
    setActividadSeleccionada(actividad);
    setModalVisible(true);
  }

  function handleModalSubmit(actividad) {
    hideModal();
  }

  function handlePacienteDetailButtonClick() {
    navigation.navigate('PacienteDetail');
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
          cantidad={14}
          color={colors.primary}
        />
        <EstadoActividad
          titulo={'PENDIENTES'}
          cantidad={2}
          color={colors.pendiente}
        />
        <EstadoActividad
          titulo={'POSPUESTAS'}
          cantidad={1}
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
          onSubmit={handleModalSubmit}
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
