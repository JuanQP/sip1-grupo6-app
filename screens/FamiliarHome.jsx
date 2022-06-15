import React, { useState } from 'react'
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { Appbar, Avatar, Card, Divider, Portal, Text, withTheme, IconButton, Caption } from 'react-native-paper';
import CalendarStrip from 'react-native-calendar-strip';
import { formatearFecha, stringToMomentMarkedDate } from '../utils/utils';
import moment from 'moment';
import 'moment/locale/es';
import EstadoActividad from '../components/Home/EstadoActividad';
import ActividadDetailsModal from '../components/Home/ActividadDetailsModal';
import ActividadesList from '../components/Home/ActividadesList';
import { useQuery } from 'react-query';
import { getHome } from '../src/api/familiarUsuario';

const hoy = moment();
const fecha = formatearFecha(hoy);
const pantallasActividades = {
  'Medicación': 'Medicacion',
  'Consulta Médica': 'Consulta',
  'Estudio Médico': 'Estudio',
  'Otro': 'Otro',
};

function FamiliarHome({ navigation, route, ...props }) {
  const { data: familiar } = useQuery('familiar-usuario',
    getHome,
    {
      placeholderData: null,
      onSuccess: (familiar) => {
        const newMarkedDates = familiar.paciente.actividades.map(a => stringToMomentMarkedDate(a.fecha, colors));
        setMarkedDates(newMarkedDates);
      },
      select: (data) => data?.familiar,
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

  function handleNotificacionesPress() {
    navigation.navigate("Notificaciones", { usuarioId: familiar.id });
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

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="Actividades" />
        <Appbar.Action icon="bell" onPress={handleNotificacionesPress} />
      </Appbar.Header>
      {/* Acá va el header! */}
      <Card style={{padding: 4}}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Avatar.Icon size={40} icon="account" />
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
          <Avatar.Icon size={40} icon="account" />
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
          actividades={familiar?.paciente?.actividades ?? []}
          color={colors.completada}
        />
        <EstadoActividad
          titulo={'PENDIENTES'}
          actividades={familiar?.paciente?.actividades ?? []}
          color={colors.pendiente}
        />
        <EstadoActividad
          titulo={'POSPUESTAS'}
          actividades={familiar?.paciente?.actividades ?? []}
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
        actividades={familiar?.paciente?.actividades ?? []}
        readOnly={true}
        onActividadClick={handleActividadClick}
      />
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
