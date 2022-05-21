import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, View } from 'react-native';
import {
  Appbar,
  withTheme
} from 'react-native-paper';
import PacienteForm from '../../components/Paciente/PacienteForm';

function NuevoPacienteScreen({ navigation, ...props }) {

  const { colors } = props.theme;

  function handleBackActionClick() {
    navigation.goBack();
  }

  function handleSavedPaciente(paciente) {
    navigation.navigate('Paciente', { pacienteId: paciente.id });
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
            onSavedPaciente={handleSavedPaciente}
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
