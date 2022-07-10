import React, { useEffect, useState } from 'react'
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { Appbar, Avatar, Card, Divider, Portal, Text, withTheme, IconButton, Caption } from 'react-native-paper';
import { imagenes, formatearFecha, stringToMomentMarkedDate } from '../utils/utils';
import moment from 'moment';
import 'moment/locale/es';
import EstadoActividad from '../components/Home/EstadoActividad';
import ActividadDetailsModal from '../components/Home/ActividadDetailsModal';
import { useQuery } from 'react-query';
import { getHome } from '../src/api/familiarUsuario';
import { getPacienteActividades } from '../src/api/paciente';
import CalendarStrip from 'react-native-calendar-strip';
import ActividadesList from '../components/Home/ActividadesList';

const hoy = moment();
const fecha = formatearFecha(hoy);
const pantallasActividades = {
  'Medicación': 'Medicacion',
  'Consulta Médica': 'Consulta',
  'Estudio Médico': 'Estudio',
  'Otro': 'Otro',
};


function FamiliarHome({ navigation, route, ...props }) {

  useEffect(() => {
    getHome()
    .then(res => {
      setFamiliar(res)
      getActividadesPaciente(res.pacienteId, fechaSeleccionada);
    })

  return () => {
    setFamiliar({});
    setActividades([]);
    setFecha(moment().format("YYYY-MM-DD"));
  }
}, []);

  const [markedDates, setMarkedDates] = useState([]);
  const [familiar, setFamiliar] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [actividadSeleccionada, setActividadSeleccionada] = useState(null);
  const { colors } = props.theme;
  const [actividades, setActividades] = useState([]);
  const [fechaSeleccionada, setFecha] = useState(moment().format("YYYY-MM-DD"));

  function getActividadesPaciente(pacienteId, fecha) {
    getPacienteActividades(pacienteId, fecha)
    .then((res) => {
      const actividadesToShow = [];
      res.forEach((a) => {
        if(moment(a.fecha).format("YYYY-MM-DD") >= moment(fecha).format("YYYY-MM-DD")) {
          actividadesToShow.push(a)
        }
      })
      const newMarkedDates = res.map(a => stringToMomentMarkedDate(a.fecha, colors));
      setActividades(actividadesToShow)
      setMarkedDates(newMarkedDates);
    })
    .catch((err) => console.error(err))
  }

  function hideModal() {
    setModalVisible(false);
  }

  function handleNotificacionesPress() {
    navigation.navigate('PacienteStack', { screen: 'Notificaciones' });
  }

  function handleActividadClick(actividad) {
    setActividadSeleccionada({...actividad});
    setModalVisible(true);
  }

  function handleActividadEditClick(actividad) {
    const { pacienteId } = route.params;
    const proximaPantalla = pantallasActividades[actividad.tipo];
    setModalVisible(false);
    navigation.navigate(proximaPantalla, { pacienteId, actividadId: actividad.id });
  }

  function handleGlosarioPress() {
    navigation.navigate('FamiliarGlosario');
  }

  function handleFechaSeleccionada(fecha) {
    setFecha(fecha.toISOString().split('T')[0]);
    getActividadesPaciente(familiar.pacienteId, fecha.toISOString().split('T')[0]);
  }

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="Actividades" />
        <Appbar.Action icon="book-alphabet" onPress={handleGlosarioPress} />
        <Appbar.Action icon="bell" onPress={handleNotificacionesPress} />
      </Appbar.Header>
      {/* Acá va el header! */}
      <Card style={{padding: 4}}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Avatar.Image size={40} source={imagenes['mirta.png']} />
          <View style={{marginLeft: 8}}>
            <Text>Mirta Pérez, 82</Text>
            <Caption>Madre</Caption>
          </View>
          <IconButton
            color={colors.primary}
            style={{marginLeft: 'auto', margin: 0, padding: 0}}
            icon="eye-outline"
            mode="text"
            onPress={() => {}}
          />
        </View>
      </Card>
      <Divider />
      <Card style={{padding: 4}}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Avatar.Image size={40} source={imagenes['nancy.jpg']} />
          <View style={{marginLeft: 8}}>
            <Text>Nancy González</Text>
            <Caption>Cuidadora</Caption>
          </View>
          <IconButton
            color={colors.primary}
            style={{marginLeft: 'auto', margin: 0, padding: 0}}
            icon="eye-outline"
            mode="text"
            onPress={() => {}}
          />
        </View>
      </Card>
      {/* Acá termina el header */}

      <Text style={{margin: 10, alignSelf: 'center'}}>
        {fecha}
      </Text>
      <View style={styles.containerEstadosActividades}>
        <EstadoActividad
          titulo={'COMPLETADAS'}
          actividades={actividades.filter(act => act.fecha.split('T')[0] == moment().format("YYYY-MM-DD")) ?? []}
          color={colors.completada}
        />
        <EstadoActividad
          titulo={'PENDIENTES'}
          actividades={actividades.filter(act => act.fecha.split('T')[0] == moment().format("YYYY-MM-DD")) ?? []}
          color={colors.pendiente}
        />
        <EstadoActividad
          titulo={'POSPUESTAS'}
          actividades={actividades.filter(act => act.fecha.split('T')[0] == moment().format("YYYY-MM-DD")) ?? []}
          color={colors.pospuesta}
        />
      </View>
      {/* Date picker */}
      <View style={{flex: 1}}>
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
          showMonth={true}
          onDateSelected={handleFechaSeleccionada}
        />
        <ActividadesList
          actividades={actividades}
          onActividadClick={handleActividadClick}
          readOnly={true}
        />
      </View>
      <Portal>
        <ActividadDetailsModal
          actividad={actividadSeleccionada}
          visible={modalVisible}
          waiting={false}
          readOnly={true}
          onEditClick={handleActividadEditClick}
          onDismiss={hideModal}
          onSubmit={() => {}}
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

export default withTheme(FamiliarHome);
