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
  const [familiar, setFamiliar] = useState({
    id: undefined,
    nombre: '',
    relacion: '',
    provinciaId: '1',
    localidad: '',
    telefono: '',
    esContactoDeEmergencia: false,
  });

  function handleBackActionClick() {
    navigation.goBack();
  }

  useEffect(() => {
    const fetchData = async () => {
      const familiarId = route.params?.familiarId;
      if(!familiarId) return;

      const response = await axios.get(`/api/familiars/${familiarId}`);
      const {provincia, ...familiarNuevo} = response.data.familiar;
      setFamiliar({
        ...familiarNuevo,
        provinciaId: provincia.id,
      });
    }
    fetchData()
      .catch(console.error)
  }, []);

  async function handleSubmit() {
    const { pacienteId } = route.params;
    const axiosQuery = familiar.id ? axios.patch : axios.post;
    const response = await axiosQuery(`/api/familiars/${familiar.id ?? ''}`, {
      ...familiar,
      pacienteId,
    });
    const {provincia, ...nuevoFamiliar} = response.data.familiar;
    setFamiliar({
      ...nuevoFamiliar,
      provinciaId: provincia.id,
    });
  }

  function handleCancel() {
    navigation.goBack();
  }

  function handleChange(field, value) {
    setFamiliar((prev) => ({...prev, [field]: value}));
  }

  return (
    <View style={{...styles.container, backgroundColor: colors.surface}}>
      <Appbar.Header>
        <Appbar.BackAction onPress={handleBackActionClick} />
        <Appbar.Content title="Familiar" />
      </Appbar.Header>
      {/* Formulario */}
      <View style={styles.formContainer}>
        <ScrollView>
          <FamiliarForm
            familiarId={route.params?.pacienteId}
            familiar={familiar}
            onCancel={handleCancel}
            onSubmit={handleSubmit}
            onChange={handleChange}
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
