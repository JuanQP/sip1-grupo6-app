import React, { useEffect, useState } from 'react'
import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Appbar, Title, withTheme } from 'react-native-paper';
import ActividadMessageModal from '../../components/ActividadMessageModal';
import MedicacionForm from '../../components/Actividades/MedicacionForm';
import { keyExtractor } from '../../utils/utils';

const axios = require('axios').default;

function MedicacionScreen({ navigation, route, ...props }) {

  const { colors } = props.theme;
  const { pacienteId, actividadId } = route.params;
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
  const [pacienteNombre, setPacienteNombre] = useState('');
  const [waitingResponse, setWaitingResponse] = useState(false);

  useEffect(() => {
    const fetchPaciente = async () => {
      const response = await axios.get(`/api/pacientes/${pacienteId}`);
      setPacienteNombre(response.data.paciente.nombre);
    }
    const fetchActividad = async () => {
      if(!actividadId) return;
      const {dias, ...actividad} = (await axios.get(`/api/actividads/${actividadId}`)).data.actividad;
      setInitialValues({
        ...actividad,
        pacienteId,
        diaIds: dias.map(keyExtractor),
        fecha: new Date(actividad.fecha),
        frecuencia: String(actividad.frecuencia),
        duracion: String(actividad.duracion),
      });
    }
    fetchPaciente().catch(console.error);
    fetchActividad().catch(console.error);
  }, []);

  async function handleSubmit(formValues, actions) {
    setWaitingResponse(true);
    try {
      const nuevaActividad = {
        ...formValues,
        pacienteId,
      };
      const axiosMethod = nuevaActividad.id ? axios.patch : axios.post;
      const url = `/api/actividads/${nuevaActividad?.id ?? ''}`;
      const { dias, ...actividad } = (await axiosMethod(url, nuevaActividad)).data.actividad;
      actions.setValues({
        ...actividad,
        pacienteId,
        diaIds: dias.map(keyExtractor),
        fecha: new Date(actividad.fecha),
        frecuencia: String(actividad.frecuencia),
        duracion: String(actividad.duracion),
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
        <Appbar.Content title={`${initialValues.id ? '' : 'Nueva '}Medicación`} />
      </Appbar.Header>
      <View style={styles.formContainer}>
        <Title>{pacienteNombre}</Title>
        <ScrollView>
          <MedicacionForm
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

export default withTheme(MedicacionScreen);
