import React, { useEffect, useState } from 'react'
import { StatusBar } from 'expo-status-bar';
import { Alert, StyleSheet, View } from 'react-native';
import { Appbar, FAB, Portal, Text, withTheme } from 'react-native-paper';
import { formatearFecha, stringToMomentMarkedDate } from '../utils/utils';
import moment from 'moment';
import 'moment/locale/es';
import EstadoActividad from '../components/Home/EstadoActividad';
import PacienteCard from '../components/Home/PacienteCard';
import ActividadDetailsModal from '../components/Home/ActividadDetailsModal';
import { useQuery, useMutation, useQueryClient, setLogger } from 'react-query';
import { getPacientePredeterminado, getPaciente, getPacienteActividades } from '../src/api/paciente';
import { updateActividad } from '../src/api/actividad';
import * as Linking from "expo-linking";
import CalendarStrip from 'react-native-calendar-strip';
import { getDias } from '../src/api/dropdown';
import ActividadesList from '../components/Home/ActividadesList';
import { filtrosAplicados, filtrosActualizados$ } from '../src/api/actividad';
import { Subscription } from 'rxjs';

const hoy = moment();
const fecha = formatearFecha(hoy);
const pantallasActividades = {
  'Medicación': 'Medicacion',
  'Consulta Médica': 'Consulta',
  'Estudio Médico': 'Estudio',
  'Otro': 'Otro',
};

function HomeScreen({ navigation, route, ...props }) {

  const [paciente, setPaciente] = useState({});
  const [dias, setDias] = useState([]);
  const [pacienteId, setPacienteId] = useState(0);
  const [actividadesToShow, setActividadesToShow] = useState([]);
  const [actividades, setActividades] = useState([]);
  const [fechaSeleccionada, setFecha] = useState(moment().format("YYYY-MM-DD"));

  useQuery('dias', getDias, {
    onSuccess: (data) => {
      setDias(data);
    }
  });

  useEffect(() => {
    let filtrosAplicadosSubscription = new Subscription();
    filtrosAplicadosSubscription = filtrosActualizados$.subscribe(() => getActividadesPaciente(1, fechaSeleccionada))
    if(route.params) {
      getPaciente(route.params.pacienteId)
      .then(res => {
        setPaciente(res)
        setPacienteId(route.params.pacienteId)
        getActividadesPaciente(res.pacienteId, fechaSeleccionada);
      })
    }
    else {
      getPacientePredeterminado()
      .then(res => {
        setPaciente(res)
        setPacienteId(res.pacienteId)
        getActividadesPaciente(res.pacienteId, fechaSeleccionada);
      })
    }

    return () => {
      setPaciente({});
      setActividades([]);
      setActividadesToShow([]);
      setPacienteId(0);
      setFecha(moment().format("YYYY-MM-DD"));
      filtrosAplicadosSubscription.unsubscribe();
    }
  }, [route.params]);

  const queryClient = useQueryClient();

  const { mutate: actividadMutate, actividadIsLoading } = useMutation(
    updateActividad,
    {
      onSuccess: () => {
        getActividadesPaciente(pacienteId, fechaSeleccionada);
        hideModal();
      },
      onError: () => Alert.alert("😞", "No se pudo actualizar esta actividad"),
    },
  );

  const [markedDates, setMarkedDates] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [actividadSeleccionada, setActividadSeleccionada] = useState(null);
  const { colors } = props.theme;

  function getActividadesPaciente(pacienteId, fecha) {
    getPacienteActividades(pacienteId, fecha)
    .then((res) => {
      const actividadesToShow = [];
      let aux = [];
      let actividades = [];
      if(filtrosAplicados) {
        if(filtrosAplicados.tiposIds.length > 0) {
          res.forEach((act) => filtrosAplicados.tiposIds.find((tipo) => act.detalle.tipo === tipo) ? aux.push(act) : null)
        } 
        if(filtrosAplicados.tiposIds.length > 0 && filtrosAplicados.estadosIds.length > 0) {
          aux.forEach((act) => filtrosAplicados.estadosIds.find((estado) => act.status === estado) ? actividades.push(act) : null)
        }
        if(filtrosAplicados.tiposIds.length == 0 && filtrosAplicados.estadosIds.length > 0) {
          res.forEach((act) => filtrosAplicados.estadosIds.find((estado) => act.status === estado) ? actividades.push(act) : null)
        }
        if(filtrosAplicados.tiposIds.length > 0 && filtrosAplicados.estadosIds.length == 0) {
          actividades = aux;
        }
        if(filtrosAplicados.tiposIds.length == 0 && filtrosAplicados.estadosIds.length == 0) {
          actividades = res;
        }
      }
      setActividades(actividades)
      actividades.forEach((a) => {
        if(moment(a.fecha).format("YYYY-MM-DD") >= moment(fecha).format("YYYY-MM-DD")) {
          actividadesToShow.push(a)
        }
      })
      const newMarkedDates = res.map(a => stringToMomentMarkedDate(a.fecha, colors));
      setActividadesToShow(actividadesToShow)
      setMarkedDates(newMarkedDates);
    })
    .catch((err) => console.error(err))
  }

  function handleFechaSeleccionada(fecha) {
    setFecha(fecha.toISOString().split('T')[0]);
    getActividadesPaciente(pacienteId, fecha.toISOString().split('T')[0]);
  }

  function hideModal() {
    setModalVisible(false);
  }

  function handlePhoneLongPress() {
    Linking.openURL(`tel:${paciente.telefono}`);
  }

  function handleNuevaActividadClick() {
    console.log('PACIENTE', pacienteId)
    navigation.navigate("Actividad", { pacienteId, dias});
  }

  function handleActividadClick(actividad) {
    setActividadSeleccionada({...actividad});
    setModalVisible(true);
  }

  async function handleActividadModalSubmit(actividadLogFormData) {
    actividadMutate(actividadLogFormData);
  }

  function handlePacienteDetailButtonClick() {
    const { pacienteId } = route.params;
    navigation.navigate('Paciente', { pacienteId });
  }

  function handleOnMisPacientesPress() {
    navigation.navigate('MisPacientes', { pacienteId });
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
        <Appbar.Action icon="phone-plus" onPress={() => {}} onLongPress={handlePhoneLongPress} />
      </Appbar.Header>
      <PacienteCard
        paciente={paciente}
        onPacienteDetailClick={handlePacienteDetailButtonClick}
        onMisPacientesPress={handleOnMisPacientesPress}
      />
      <Text style={{margin: 10, alignSelf: 'center'}}>
        {fecha}
      </Text>
      <View style={styles.containerEstadosActividades}>
        <EstadoActividad
          titulo={'COMPLETADAS'}
          actividades={actividades.filter(act => act.fecha.split('T')[0] == moment().format("YYYY-MM-DD"))}
          color={colors.completada}
        />
        <EstadoActividad
          titulo={'PENDIENTES'}
          actividades={actividades.filter(act => act.fecha.split('T')[0] == moment().format("YYYY-MM-DD"))}
          color={colors.pendiente}
        />
        <EstadoActividad
          titulo={'POSPUESTAS'}
          actividades={actividades.filter(act => act.fecha.split('T')[0] == moment().format("YYYY-MM-DD"))}
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
          actividades={actividadesToShow}
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
