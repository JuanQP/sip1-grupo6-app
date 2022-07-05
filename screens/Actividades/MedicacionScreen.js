import React, { useState } from 'react'
import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Appbar, Title, withTheme } from 'react-native-paper';
import ActividadMessageModal from '../../components/ActividadMessageModal';
import MedicacionForm from '../../components/Actividades/MedicacionForm';
import { keyExtractor } from '../../utils/utils';
import { getPaciente } from '../../src/api/paciente';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { createOrUpdateActividad, getActividad } from '../../src/api/actividad';
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
        let diasSemana = actividad.diasSemana.split(",");
        let diasIds = [];
        diasSemana.forEach((d) => {
          let sel = dias.find(dia => d == dia['descripcion']);
          diasIds.push(sel.id);
        })
        setInitialValues({
          ...actividad,
          pacienteId,
          diaIds: diasIds,
          fecha: new Date(actividad.fecha),
          frecuencia: String(actividad.frecuencia),
          duracion: String(actividad.duracion),
        });
      },
      enabled: !!actividadId,
    },
  );
  const { mutate, actividadIsLoading } = useMutation(createOrUpdateActividad);
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
        const { dias, ...actividad } = data;
        actions.setValues({
          ...actividad,
          pacienteId,
          diaIds: dias.map(keyExtractor),
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
    if(!isfechaYHoraLibre) {
      crearActividadAlert(
        () =>  {
          formValues.diaIds = formValues.diaIds.map((dia) => dia = dias.find((d) => d.id == dia).descripcion);
          formValues.diaIds = formValues.diaIds.toString();
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
            onCancel={handleBackActionClick}
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
