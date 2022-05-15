import React, { useEffect, useState } from 'react'
import { StatusBar } from 'expo-status-bar';
import { Alert, FlatList, StyleSheet, View } from 'react-native';
import { Appbar, FAB, Text, withTheme } from 'react-native-paper';
import CalendarStrip from 'react-native-calendar-strip';
import { momentRange, momentToMarkedDate } from '../utils/utils';
import moment from 'moment';
import 'moment/locale/es';
import EstadoActividad from '../components/EstadoActividad';
import PacienteCard from '../components/PacienteCard';
import ActividadRow from '../components/ActividadRow';

moment.locale("es");
const hoy = moment();
const fecha = hoy
    .format("dddd[, ]DD[ de ]MMMM[, ]YYYY")
    .toUpperCase();

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
    tipo: 'completada',
  },
  {
    id: 2,
    fecha: hoy.clone().set({hour: 17, minute: 0}),
    descripcion: "Enalapril",
    tipo: 'pendiente',
  },
  {
    id: 3,
    fecha: hoy.clone().set({hour: 17, minute: 30}),
    descripcion: "Diurex",
    tipo: 'pendiente',
  },
  {
    id: 4,
    fecha: hoy.clone().add(1, "days").set({hour: 8, minute: 30}),
    descripcion: "Aricept",
    tipo: 'pendiente',
  },
  {
    id: 5,
    fecha: hoy.clone().add(1, "days").set({hour: 9, minute: 0}),
    descripcion: "Multivitamínico",
    tipo: 'pendiente',
  },
  {
    id: 6,
    fecha: hoy.clone().add(1, "days").set({hour: 17, minute: 0}),
    descripcion: "Enalapril",
    tipo: 'pendiente',
  },
  {
    id: 7,
    fecha: hoy.clone().add(1, "days").set({hour: 17, minute: 30}),
    descripcion: "Diurex",
    tipo: 'pendiente',
  },
];

function HomeScreen({ navigation, ...props }) {

  const [fechaSeleccionada] = useState(moment());
  const [markedDates, setMarkedDates] = useState([]);
  const { colors } = props.theme;

  useEffect(() => {
    const fecha_inicio = hoy.clone().subtract(3, "days");
    const fecha_fin = hoy.clone().add(4, "days");
    const fechas = momentRange(fecha_inicio, fecha_fin);

    setMarkedDates(fechas.map((f) => momentToMarkedDate(f, colors)));
  }, []);


  function proximamenteAlert() {
    Alert.alert("Próximamente...", "😁");
  }

  function onMisPacientesClick() {
    navigation.navigate("MisPacientes");
  }

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Action icon="menu" onPress={proximamenteAlert} />
        <Appbar.Content title="Actividades" />
        <Appbar.Action icon="account-group" onPress={onMisPacientesClick} />
      </Appbar.Header>
      <PacienteCard paciente={paciente}/>
      <Text style={{margin: 10, alignSelf: 'center'}}>
        {fecha}
      </Text>
      <View style={styles.containerEstadosActividades}>
        <EstadoActividad titulo={'COMPLETADAS'} cantidad={14} color={colors.primary}/>
        <EstadoActividad titulo={'PENDIENTES'} cantidad={2} color={colors.pendiente}/>
        <EstadoActividad titulo={'POSPUESTAS'} cantidad={1} color={colors.pospuesta}/>
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
        renderItem={({ item }) => <ActividadRow actividad={item}/>}
        keyExtractor={actividad => actividad.id}
      />
      {/* Botón flotante */}
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={proximamenteAlert}
      />
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
