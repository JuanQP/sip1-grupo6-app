import React, { useEffect, useState } from 'react'
import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Appbar, Title, withTheme } from 'react-native-paper';
import ActividadMessageModal from '../../components/ActividadMessageModal';
import MedicacionForm from './Forms/MedicacionForm';

const axios = require('axios').default;

function MedicacionScreen({ navigation, route, ...props }) {

  const { colors } = props.theme;
  const { pacienteId, actividadId } = route.params;

  const [modalVisible, setModalVisible] = useState(false);
  const [pacienteNombre, setPacienteNombre] = useState('');
  const [waitingResponse, setWaitingResponse] = useState(false);

  function handleBackActionClick() {
    navigation.goBack();
  }

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(`/api/pacientes/${pacienteId}`);
      setPacienteNombre(response.data.paciente.nombre);
    }

    fetchData()
      .catch(console.error)
  }, []);

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
        <Appbar.Content title={`${actividadId ? '' : 'Nueva '}Medicación`} />
      </Appbar.Header>
      <View style={styles.formContainer}>
        <Title>{pacienteNombre}</Title>
        <ScrollView>
          <MedicacionForm
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
        message={""}
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
