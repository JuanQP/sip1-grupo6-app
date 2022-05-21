import React, { useEffect, useState } from 'react'
import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Appbar, Title, withTheme } from 'react-native-paper';
import ActividadMessageModal from '../../components/ActividadMessageModal';
import EstudioForm from './Forms/EstudioForm';

const axios = require('axios').default;

function EstudioScreen({ navigation, route, ...props }) {

  const { colors } = props.theme;
  const { pacienteId, actividadId } = route.params;

  const [waitingResponse, setWaitingResponse] = useState(false);
  const [pacienteNombre, setPacienteNombre] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const pacienteResponse = await axios.get(`/api/pacientes/${pacienteId}`);
      setPacienteNombre(pacienteResponse.data.paciente.nombre);
    }

    fetchData()
      .catch(console.error)
  }, []);

  function handleBackActionClick() {
    navigation.goBack();
  }

  async function handleSubmit(actividad) {
    setWaitingResponse(true);
    const nuevaActividad = {
      pacienteId,
      ...actividad,
    };
    try {
      if(actividadId) {
        await axios.patch(`/api/actividads/${actividadId}`, nuevaActividad);
      }
      else {
        await axios.post(`/api/actividads/`, nuevaActividad);
      }
      setModalVisible(true);
    } catch (error) {
      console.error(error.message);
    }
    finally {
      setWaitingResponse(false);
    }
  }

  function hideModal() {
    setModalVisible(false);
    navigation.navigate('Home', { pacienteId });
  }

  return (
    <View style={{...styles.container, backgroundColor: colors.surface}}>
      <Appbar.Header>
        <Appbar.BackAction onPress={handleBackActionClick} />
        <Appbar.Content title={`${actividadId ? '' : 'Nuevo '}Estudio Médico`} />
      </Appbar.Header>
      {/* Formulario */}
      <View style={styles.formContainer}>
        <ScrollView>
          <Title>{pacienteNombre}</Title>
          <EstudioForm
            actividadId={actividadId}
            waitingResponse={waitingResponse}
            onSubmit={handleSubmit}
            onCancel={handleBackActionClick}
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
