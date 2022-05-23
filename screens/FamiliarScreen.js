import React, { useEffect, useState } from 'react'
import { StatusBar } from 'expo-status-bar';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import {
  Appbar,
  withTheme
} from 'react-native-paper';
import FamiliarForm from '../components/Familiares/FamiliarForm';

const axios = require('axios').default;

function FamiliarScreen({ navigation, route, ...props }) {

  const { colors } = props.theme;
  const [waitingResponse, setWaitingResponse] = useState(false);
  const [editando, setEditando] = useState(false);
  const [initialValues, setInitialValues] = useState({
    id: undefined,
    nombre: '',
    relacion: '',
    provinciaId: '1',
    localidad: '',
    telefono: '',
    esContactoDeEmergencia: false,
  });

  useEffect(() => {
    const fetchData = async () => {
      const familiarId = route.params?.familiarId;
      if(!familiarId) return;

      const response = await axios.get(`/api/familiars/${familiarId}`);
      const {provincia, ...familiarNuevo} = response.data.familiar;

      setInitialValues({
        ...familiarNuevo,
        provinciaId: provincia.id
      });
      setEditando(true);
    }

    fetchData().catch(console.error);
  }, []);

  async function handleSubmit(familiar, actions) {
    const { pacienteId } = route.params;
    const axiosMethod = familiar.id ? axios.patch : axios.post;
    const data = {
      ...familiar,
      pacienteId,
    }

    setWaitingResponse(true);
    const response = await axiosMethod(`/api/familiars/${familiar.id ?? ''}`, data);
    setWaitingResponse(false);

    const {provincia, ...nuevoFamiliar} = response.data.familiar;
    navigation.setParams({ familiarId: nuevoFamiliar.id });
    actions.setValues({
      ...nuevoFamiliar,
      provinciaId: provincia.id,
    });
    setEditando(true);
    Alert.alert("✅", "Familiar guardado");
  }

  function handleBackActionClick() {
    navigation.goBack();
  }

  function handleCancel() {
    navigation.goBack();
  }

  return (
    <View style={{...styles.container, backgroundColor: colors.surface}}>
      <Appbar.Header>
        <Appbar.BackAction onPress={handleBackActionClick} />
        <Appbar.Content title="Familiar" />
      </Appbar.Header>
      <View style={styles.formContainer}>
        <ScrollView>
          <FamiliarForm
            initialValues={initialValues}
            editando={editando}
            waitingResponse={waitingResponse}
            onCancel={handleCancel}
            onSubmit={handleSubmit}
          />
        </ScrollView>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  formContainer: {
    padding: 20,
    marginBottom: 80,
    justifyContent: 'center',
  },
});

export default withTheme(FamiliarScreen);
