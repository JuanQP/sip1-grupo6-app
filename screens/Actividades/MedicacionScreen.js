import React, { useState } from 'react'
import { StatusBar } from 'expo-status-bar';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { Appbar, Title, withTheme } from 'react-native-paper';
import ActividadMessageModal from '../../components/ActividadMessageModal';
import MedicacionForm from '../../components/Actividades/MedicacionForm';
import { diasSemanaAIds, idsADiasSemana } from '../../utils/utils';
import { getPaciente } from '../../src/api/paciente';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { createOrUpdateActividad, deleteActividad, getActividad } from '../../src/api/actividad';
import { crearActividadAlert, fechaYHoraLibre } from './ActividadesScreen';

function MedicacionScreen({ navigation, route, ...props }) {
  const queryClient = useQueryClient();
  const { pacienteId, actividadId, dias } = route.params;
  const { data: paciente } = useQuery('paciente',
    () => getPaciente(pacienteId),
    {
      placeholderData: {
        nombre: '',
      },
    },
  );
  useQuery('actividad',
    () => getActividad(actividadId),
    {
      onSuccess: (data) => {
        const actividad= data;
        setInitialValues({
          ...actividad,
          pacienteId,
          diaIds: diasSemanaAIds(actividad.diasSemana, dias),
          fecha: new Date(actividad.fecha),
          frecuencia: String(actividad.frecuencia),
          duracion: String(actividad.duracion),
        });
      },
      enabled: !!actividadId,
    },
  );
  const { mutate, actividadIsLoading } = useMutation(createOrUpdateActividad);
  const { mutate: deleteMutation } = useMutation(deleteActividad, {
    onSuccess: () => {
      queryClient.invalidateQueries(['actividades']);
      navigation.popToTop();
      navigation.navigate('Home');
    },
  });
  const { colors } = props.theme;
  const [initialValues, setInitialValues] = useState({
    id: undefined,
    nombre: '',
    observaciones: '',
    dosis: '',
    duracion: '',
    frecuencia: '',
    diaIds: [],
    fecha: new Date(),
  });
  const [modalVisible, setModalVisible] = useState(false);

  async function mutateActividad(formValues, actions) {
    const nuevaActividad = {
      ...formValues,
      pacienteId,
    };
    mutate(nuevaActividad, {
      onSuccess: (data) => {
        const { diasSemana, ...actividad } = data;
        actions.setValues({
          ...actividad,
          pacienteId,
          diaIds: diasSemanaAIds(diasSemana, dias),
          fecha: new Date(actividad.fecha),
          frecuencia: String(actividad.frecuencia),
          duracion: String(actividad.duracion),
        });
        setModalVisible(true);
        queryClient.invalidateQueries(['actividades']);
      },
    });
  }

  async function handleSubmit(formValues, actions) {
    const isfechaYHoraLibre = await fechaYHoraLibre(formValues.fecha);
    const { diaIds } = formValues;
    const diasSemanaSeleccionados = idsADiasSemana(diaIds, dias);
    formValues.diaIds = diasSemanaSeleccionados;

    if(!isfechaYHoraLibre) {
      crearActividadAlert(
        () =>  {
          mutateActividad(formValues, actions)},
        () => {},
      );
      return;
    }
    mutateActividad(formValues, actions);
  }

  function hideModal() {
    setModalVisible(false);
  }

  function handleDelete(actividadId) {
    Alert.alert(
      "Borrar actividad",
      "Se van a borrar las actividades agendadas, pero no las que ya ocurrieron. ¿Estás seguro?",
      [
        {
          text: 'No',
          onPress: () => {},
          style: 'cancel'
        },
        {
          text: 'Si',
          onPress: () => deleteMutation(actividadId),
          style: 'destructive',
        }
      ]
    );
  }

  function handleBackActionClick() {
    navigation.goBack();
  }

  return (
    <View style={{...styles.container, backgroundColor: colors.surface}}>
      <Appbar.Header>
        <Appbar.BackAction onPress={handleBackActionClick} />
        <Appbar.Content title={`${initialValues.id ? '' : 'Nueva '}Medicación`} />
      </Appbar.Header>
      <View style={styles.formContainer}>
        {paciente ? <Title>{paciente.nombre}</Title> : null}
        <ScrollView>
          <MedicacionForm
            initialValues={initialValues}
            loading={actividadIsLoading}
            onDelete={handleDelete}
            onSubmit={handleSubmit}
          />
        </ScrollView>
      </View>
      <StatusBar style="auto" />
      <ActividadMessageModal
        visible={modalVisible}
        onDismiss={hideModal}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  formContainer: {
    padding: 20,
    marginBottom: 60,
    justifyContent: 'center',
  },
});

export default withTheme(MedicacionScreen);
