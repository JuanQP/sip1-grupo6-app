import React, { useState } from 'react'
import { StatusBar } from 'expo-status-bar';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { Appbar, Title, withTheme } from 'react-native-paper';
import ActividadMessageModal from '../../components/ActividadMessageModal';
import EstudioForm from '../../components/Actividades/EstudioForm';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { createOrUpdateActividad, deleteActividad, getActividad } from '../../src/api/actividad';
import { getPaciente } from '../../src/api/paciente';
import { crearActividadAlert, fechaYHoraLibre } from './ActividadesScreen';

function EstudioScreen({ navigation, route, ...props }) {
  const queryClient = useQueryClient();
  const { pacienteId, actividadId } = route.params;
  const { data: paciente } = useQuery('paciente',
    () => getPaciente(pacienteId),
    {
      placeholderData: {
        nombre: '',
      },
    },
  );
  const { data: actividad } = useQuery('actividad',
    () => getActividad(actividadId),
    {
      onSuccess: (actividad) => {
        setInitialValues({
          ...actividad,
          pacienteId,
          fecha: new Date(actividad.fecha),
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
    direccion: '',
    fecha: new Date(),
  });
  const [modalVisible, setModalVisible] = useState(false);

  function mutateActividad(formValues, actions) {
    const nuevaActividad = { pacienteId, ...formValues };
    mutate(nuevaActividad, {
      onSuccess: (data) => {
        actions.setValues({
          ...data,
          pacienteId,
          fecha: new Date(data.fecha),
        });
        setModalVisible(true);
        queryClient.invalidateQueries(['actividades']);
      },
    });
  }

  async function handleSubmit(formValues, actions) {
    const isfechaYHoraLibre = await fechaYHoraLibre(formValues.fecha);
    if(!isfechaYHoraLibre) {
      crearActividadAlert(
        () => mutateActividad(formValues, actions),
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
        <Appbar.Content title={`${initialValues.id ? '' : 'Nuevo '}Estudio Médico`} />
      </Appbar.Header>
      {/* Formulario */}
      <View style={styles.formContainer}>
        <ScrollView>
          <Title>{paciente.nombre}</Title>
          <EstudioForm
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

export default withTheme(EstudioScreen);
