import React, { useEffect, useState } from 'react'
import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Appbar, Title, withTheme } from 'react-native-paper';
import ActividadMessageModal from '../../components/ActividadMessageModal';
import ConsultaForm from '../../components/Actividades/ConsultaForm';

const axios = require('axios').default;

function ConsultaScreen({ navigation, route, ...props }) {

  const { colors } = props.theme;
  const { pacienteId, actividadId } = route.params;
  const [initialValues, setInitialValues] = useState({
    id: undefined,
    nombre: '',
    observaciones: '',
    direccion: '',
    fecha: new Date(),
  });
  const [waitingResponse, setWaitingResponse] = useState(false);
  const [pacienteNombre, setPacienteNombre] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const pacienteResponse = await axios.get(`/api/pacientes/${pacienteId}`);
      setPacienteNombre(pacienteResponse.data.paciente.nombre);
    }
    const fetchActividad = async () => {
      if(!actividadId) return;
      const { actividad } = (await axios.get(`/api/actividads/${actividadId}`)).data;
      setInitialValues({
        ...actividad,
        pacienteId,
        fecha: new Date(actividad.fecha),
      });
    }
    fetchData().catch(console.error);
    fetchActividad().catch(console.error);
  }, []);

  async function handleSubmit(formValues, actions) {
    setWaitingResponse(true);
    const nuevaActividad = {
      pacienteId,
      ...formValues,
    };
    try {
      const axiosMethod = formValues.id ? axios.patch : axios.post;
      const url = `/api/actividads/${nuevaActividad.id ?? ''}`;
      const { actividad } = (await axiosMethod(url, nuevaActividad)).data;
      actions.setValues({
        ...actividad,
        pacienteId,
        fecha: new Date(actividad.fecha),
      });
      setModalVisible(true);
    }
    catch (error) {
      console.error(error.message);
    }
    finally {
      setWaitingResponse(false);
    }
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
          <Title>{pacienteNombre}</Title>
          <ConsultaForm
            initialValues={initialValues}
            loading={waitingResponse}
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
