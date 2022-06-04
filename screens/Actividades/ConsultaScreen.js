import React, { useState } from 'react'
import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Appbar, Title, withTheme } from 'react-native-paper';
import ActividadMessageModal from '../../components/ActividadMessageModal';
import ConsultaForm from '../../components/Actividades/ConsultaForm';
import { getPaciente } from '../../src/api/paciente';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { createOrUpdateActividad, getActividad } from '../../src/api/actividad';

function ConsultaScreen({ navigation, route, ...props }) {
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
  useQuery('actividad',
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
  const { colors } = props.theme;
  const [initialValues, setInitialValues] = useState({
    id: undefined,
    nombre: '',
    observaciones: '',
    direccion: '',
    fecha: new Date(),
  });
  const [modalVisible, setModalVisible] = useState(false);

  async function handleSubmit(formValues, actions) {
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
        <Appbar.Content title={`${initialValues.id ? '' : 'Nueva '}Consulta Médica`} />
      </Appbar.Header>
      {/* Formulario */}
      <View style={styles.formContainer}>
        <ScrollView>
          <Title>{paciente.nombre}</Title>
          <ConsultaForm
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

export default withTheme(ConsultaScreen);
