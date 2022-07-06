import React, { useEffect, useState } from 'react'
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
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { getPaciente, updatePaciente } from '../src/api/paciente';
import { getFamiliares } from '../src/api/familiar';

function PacienteScreen({ navigation, route, ...props }) {
  const { colors } = props.theme;
  const { pacienteId } = route.params;
  const [imagen, setImagen] = useState('');
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
  const queryClient = useQueryClient();
  const { mutate, isLoading: isPacienteLoading } = useMutation(updatePaciente);
  useQuery('paciente',
    () => getPaciente(pacienteId),
    {
      onSuccess: (data) => {
        const {
          sexoId,
          tipoDocumentoId,
          provinciaId,
          imagen,
          ...paciente
        } = data;
        setInitialValues({
          ...paciente,
          sexoId: sexoId,
          tipoDocumentoId: tipoDocumentoId,
          provinciaId: provinciaId,
          fechaNacimiento: new Date(paciente.fechaNacimiento),
        });
        setImagen(imagen);
      },
      enabled: !!pacienteId,
    },
  );

  useEffect(() => {
    getFamiliares(pacienteId)
    .then((res) => setFamiliares(res))
    .catch((err) => console.error(err))

    return () => {
      setFamiliares([])
    }
  }, []);

  async function handleSubmit(formValues, actions) {
    mutate(formValues, {
      onSuccess: (data) => {
        const {
          sexo,
          tipoDocumento,
          provincia,
          familiars,
          imagen,
          ...paciente
        } = data;
        actions.setValues({
          ...paciente,
          sexoId: sexo.id,
          tipoDocumentoId: tipoDocumento.id,
          provinciaId: provincia.id,
          fechaNacimiento: new Date(paciente.fechaNacimiento),
        });
        setFamiliares(familiars);
        setImagen(imagen);
        queryClient.invalidateQueries(['paciente']);
      },
    });
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
            loading={isPacienteLoading}
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
