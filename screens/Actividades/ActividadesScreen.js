import React from 'react'
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { Appbar, withTheme } from 'react-native-paper';
import 'moment/locale/es';
import ActividadTouchableCard from '../../components/Actividades/ActividadTouchableCard';

function ActividadesScreen({ navigation, route, ...props }) {

  const { colors } = props.theme;
  const { pacienteId } = route.params;

  function handleBackActionClick() {
    navigation.goBack();
  }

  function handleNuevaMedicacion() {
    navigation.navigate('Medicacion', { pacienteId });
  }

  function handleNuevaConsulta() {
    navigation.navigate('Consulta', { pacienteId });
  }

  function handleNuevoEstudio() {
    navigation.navigate('Estudio', {pacienteId });
  }

  function handleNuevoOtro() {
    navigation.navigate('Otro', { pacienteId });
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
          <ActividadTouchableCard
            title="Medicación"
            icon="pill"
            color={colors.primary}
            onPress={handleNuevaMedicacion}
          />
          <ActividadTouchableCard
            title="Consulta Médica"
            icon="doctor"
            color={colors.primary}
            onPress={handleNuevaConsulta}
          />
        </View>
        <View style={styles.row}>
          <ActividadTouchableCard
            title="Estudio Médico"
            icon="hospital-building"
            color={colors.primary}
            onPress={handleNuevoEstudio}
          />
          <ActividadTouchableCard
            title="Otro"
            icon="dots-horizontal"
            color={colors.primary}
            onPress={handleNuevoOtro}
          />
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
  cardsContainer: {
    padding: 20,
  },
});

export default withTheme(ActividadesScreen);
