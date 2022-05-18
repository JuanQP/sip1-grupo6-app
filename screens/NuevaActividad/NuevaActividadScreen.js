import React from 'react'
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { Appbar, IconButton, Surface, Text, withTheme } from 'react-native-paper';
import 'moment/locale/es';

function NuevaActividadScreen({ navigation, route, ...props }) {

  const { colors } = props.theme;
  const { pacienteId } = route.params;

  function handleBackActionClick() {
    navigation.goBack();
  }

  function handleNuevaMedicacion() {
    navigation.navigate('NuevaMedicacion', { pacienteId });
  }

  function handleNuevaConsulta() {
    navigation.navigate('NuevaConsulta', { pacienteId });
  }

  function handleNuevoEstudio() {
    navigation.navigate('NuevoEstudio', {pacienteId });
  }

  function handleNuevoOtro() {
    navigation.navigate('NuevoOtro', { pacienteId });
  }

  return (
    <View style={{...styles.container, backgroundColor: colors.surface}}>
      <Appbar.Header>
        <Appbar.BackAction onPress={handleBackActionClick} />
        <Appbar.Content title="Tipo de Actividad" />
      </Appbar.Header>
      {/* Formulario */}
      <View style={styles.cardsContainer}>
        <View style={styles.row}>
          <Surface style={styles.card} onTouchStart={handleNuevaMedicacion}>
            <Text>Medicación</Text>
            <IconButton color={colors.primary} icon="pill" />
          </Surface>
          <Surface style={styles.card} onTouchStart={handleNuevaConsulta}>
            <Text>Consulta Médica</Text>
            <IconButton color={colors.primary} icon="doctor" />
          </Surface>
        </View>
        <View style={styles.row}>
          <Surface style={styles.card} onTouchStart={handleNuevoEstudio}>
            <Text>Estudio Médico</Text>
            <IconButton color={colors.primary} icon="hospital-building" />
          </Surface>
          <Surface style={styles.card} onTouchStart={handleNuevoOtro}>
            <Text>Otro</Text>
            <IconButton color={colors.primary} icon="dots-horizontal" />
          </Surface>
        </View>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
  },
  card: {
    height: 100,
    margin: 10,
    elevation: 4,
    flex: 1,
    alignItems: "center",
    justifyContent: 'center',
  },
  cardsContainer: {
    padding: 20,
  },
});

export default withTheme(NuevaActividadScreen);
