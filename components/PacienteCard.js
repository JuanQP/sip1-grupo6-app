import { StyleSheet, View } from 'react-native';
import { Avatar, Caption, IconButton, Text, withTheme } from 'react-native-paper';
import moment from 'moment';
import { imagenes } from '../utils/utils';

function PacienteCard({ paciente, loading, onPacienteDetailClick, ...props }) {

  const { nombre, provincia, localidad, obraSocial, numeroObraSocial, imagen } = paciente ?? {};
  const hoy = moment();
  const edad = hoy.diff(moment(paciente?.fechaNacimiento, "DD/MM/YYYY"), 'years');
  const ubicacion = `${provincia}, ${localidad}`;
  const { colors } = props.theme;

  return (
    <View style={{ ...styles.card, backgroundColor: colors.surface }}>
      <Avatar.Image size={64} source={imagenes[imagen]} />
      <View style={{marginLeft: 10}}>
        <Text>{loading ? '' : `${nombre}, ${edad}`}</Text>
        <Caption>{loading ? '' : ubicacion}</Caption>
        <Caption>{loading ? '' : `${obraSocial} - ${numeroObraSocial}`}</Caption>
      </View>
      <IconButton
        style={{marginLeft: 'auto'}}
        icon="dots-horizontal" mode="text"
        color={colors.primary}
        onPress={onPacienteDetailClick}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    padding: 10,
  },
});

export default withTheme(PacienteCard);
