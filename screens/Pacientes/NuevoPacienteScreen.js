import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, View } from 'react-native';
import {
  Appbar,
  withTheme
} from 'react-native-paper';
import PacienteForm from '../../components/Paciente/PacienteForm';
import { useMutation, useQueryClient } from 'react-query';
import { createPaciente } from '../../src/api/paciente';

const initialValues = {
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
};

function NuevoPacienteScreen({ navigation, ...props }) {
  const { colors } = props.theme;
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation(createPaciente, {
    onSuccess: (data) => {
      queryClient.invalidateQueries(['pacientes']);
      navigation.navigate('MisPacientes');
    },
  });

  function handleBackActionClick() {
    navigation.goBack();
  }

  function handleSubmit(paciente) {
    mutate({
      ...paciente,
      usuarioId: 1,
    });
  }

  return (
    <View style={{...styles.container, backgroundColor: colors.surface}}>
      <Appbar.Header>
        <Appbar.BackAction onPress={handleBackActionClick} />
        <Appbar.Content title="Nuevo Paciente" />
      </Appbar.Header>
      {/* Formulario */}
      <View style={styles.formContainer}>
        <ScrollView>
          <PacienteForm
            initialValues={initialValues}
            onSubmit={handleSubmit}
            loading={isLoading}
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
    marginBottom: 60,
    justifyContent: 'center',
  },
});

export default withTheme(NuevoPacienteScreen);
