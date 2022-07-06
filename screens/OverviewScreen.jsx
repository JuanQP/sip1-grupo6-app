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
import { getDias } from '../src/api/dropdown';
import EstadoActividad from '../components/Home/EstadoActividad';
import moment from "moment";
import { filtrosAplicados, filtrosActualizados$ } from '../src/api/actividad';
import { useEffect } from 'react';
import { Subscription } from 'rxjs';

const pantallasActividades = {
  'Medicación': 'Medicacion',
  'Consulta Médica': 'Consulta',
  'Estudio Médico': 'Estudio',
  'Otro': 'Otro',
};

function OverviewScreen({ navigation }) {
  const { colors } = useTheme();
  const [dias, setDias] = useState([]);
  const [actividades, setActividades] = useState([]);
  const queryClient = useQueryClient();
  const inicioSemana = moment().startOf('isoWeek').format('DD/MM/YYYY');
  const finSemana = moment().endOf('isoWeek').format('DD/MM/YYYY');

  useEffect(() => {
    getSemana()
    let filtrosAplicadosSubscription = new Subscription();
    filtrosAplicadosSubscription = filtrosActualizados$.subscribe(() => getSemana())
    return () => {
      setActividades([]);
      filtrosAplicadosSubscription.unsubscribe();
    }
  }, []);

  useQuery('dias', getDias, {
    onSuccess: (data) => {
      setDias(data);
    }
  });

  const { mutate: actividadMutate, actividadIsLoading } = useMutation(
    updateActividad,
    {
      onSuccess: () => {
        getSemana()
        hideModal();
      },
      onError: () => Alert.alert("😞", "No se pudo actualizar esta actividad"),
    },
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [actividadSeleccionada, setActividadSeleccionada] = useState(null);

  function getSemana() {
    getMiSemana()
    .then((res) => {
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
    })
    .catch(err => console.error(err))
  }

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
    actividadMutate(actividad);
  }

  useFocusEffect(
    useCallback(() => {
      queryClient.invalidateQueries(['mi-semana']);
    }, [])
  );

  function handleActividadEditClick(actividad) {
    const { pacienteId, actividadId, tipo } = actividad.detalle;
    const proximaPantalla = pantallasActividades[tipo];
    setModalVisible(false);
    navigation.navigate('PacienteStack', { screen: proximaPantalla, params: { pacienteId, actividadId, dias } });
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
