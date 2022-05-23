import React, { useCallback, useState } from 'react'
import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, View } from 'react-native';
import {
  Appbar,
  Avatar,
  Button,
  Title,
  withTheme
} from 'react-native-paper';
import { imagenes } from '../utils/utils';
import PacienteForm from '../components/Paciente/PacienteForm';
import FamiliaresList from '../components/Paciente/FamiliaresList';
import { useFocusEffect } from '@react-navigation/native';

const axios = require('axios').default;

function PacienteScreen({ navigation, route, ...props }) {

  const { colors } = props.theme;
  const { pacienteId } = route.params;
  const [imagen, setImagen] = useState('');
  const [waitingResponse, setWaitingResponse] = useState(false);
  const [familiares, setFamiliares] = useState([]);
  const [initialValues, setInitialValues] = useState({
    nombre: '',
    fechaNacimiento: new Date(),
    sexoId: 1,
    tipoDocumentoId: 1,
    numeroDocumento: '',
    telefono: '',
    domicilio: '',
    provinciaId: 1,
    localidad: '',
    obraSocial: '',
    numeroAfiliado: '',
    observaciones: '',
  });

  useFocusEffect(
    useCallback(() => {
      const fetchPaciente = async () => {
        if(!pacienteId) return;
        const {
          sexo,
          tipoDocumento,
          provincia,
          familiars,
          imagen,
          ...paciente
        } = (await axios.get(`/api/pacientes/${pacienteId}`)).data.paciente;
  
        setInitialValues({
          ...paciente,
          sexoId: sexo.id,
          tipoDocumentoId: tipoDocumento.id,
          provinciaId: provincia.id,
          fechaNacimiento: new Date(paciente.fechaNacimiento),
        });
        setFamiliares(familiars);
        setImagen(imagen);
      }
      fetchPaciente().catch(console.error);
    }, [])
  );

  async function handleSubmit(formValues, actions) {
    setWaitingResponse(true);
    try {
      const axiosMethod = formValues.id ? axios.patch : axios.post;
      const url = `/api/pacientes/${formValues?.id ?? ''}`;
      const {
        sexo,
        tipoDocumento,
        provincia,
        familiars,
        imagen,
        ...paciente
      } = (await axiosMethod(url, formValues)).data.paciente;
      actions.setValues({
        ...paciente,
        sexoId: sexo.id,
        tipoDocumentoId: tipoDocumento.id,
        provinciaId: provincia.id,
        fechaNacimiento: new Date(paciente.fechaNacimiento),
      });
      setFamiliares(familiars);
      setImagen(imagen);
    }
    catch (error) {
      console.error(error.message);
    }
    finally {
      setWaitingResponse(false);
    }
  }

  function handleBackActionClick() {
    navigation.goBack();
  }

  function handleNewFamiliar() {
    const { pacienteId } = route.params;
    navigation.navigate('FamiliarScreen', { pacienteId });
  }

  function handleEditFamiliar(familiar) {
    const { pacienteId } = route.params;
    navigation.navigate('FamiliarScreen',{ pacienteId, familiarId: familiar.id });
  }

  return (
    <View style={{...styles.container, backgroundColor: colors.surface}}>
      <Appbar.Header>
        <Appbar.BackAction onPress={handleBackActionClick} />
        <Appbar.Content title="Mi Paciente" />
      </Appbar.Header>
      {/* Formulario */}
      <View style={styles.formContainer}>
        <ScrollView>
          <Avatar.Image
            style={{alignSelf: "center"}}
            size={64}
            source={imagenes[imagen]}
          />
          <PacienteForm
            initialValues={initialValues}
            loading={waitingResponse}
            onSubmit={handleSubmit}
          />
          <View style={{ backgroundColor: colors.surface, marginTop: 20 }}>
            <Title style={{alignSelf: "center"}}>Familiares</Title>
            <FamiliaresList
              familiares={familiares}
              onEditFamiliar={handleEditFamiliar}
            />
            <Button
              mode='contained'
              onPress={handleNewFamiliar}
              icon="account-plus"
            >
              Agregar familiar
            </Button>
          </View>
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

export default withTheme(PacienteScreen);
