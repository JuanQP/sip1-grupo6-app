import { StyleSheet, View } from 'react-native';
import { Avatar, Caption, IconButton, Text, withTheme } from 'react-native-paper';
import moment from 'moment';
import { imagenes, getProvincias } from '../../utils/utils';

function PacienteCard({ paciente, loading, onPacienteDetailClick, onMisPacientesPress, ...props }) {

  const { nombre, localidad, obraSocial, numeroAfiliado, imagen } = paciente ?? {};
  const provincia = getProvincias().find(prov => prov.id == paciente.provinciaId);
  const hoy = moment();
  const edad = hoy.diff(moment(paciente?.fechaNacimiento, "YYYY-MM-DD"), 'years');
  const ubicacion = `${provincia?.descripcion}, ${localidad}`;
  const { colors } = props.theme;

  return (
    <View style={{ ...styles.card, backgroundColor: colors.surface }}>
      <Avatar.Image size={64} source={imagenes[imagen]} />
      <View style={{marginLeft: 10}}>
        <Text>{nombre ? `${nombre}, ${edad}` : ''}</Text>
        <Caption>{provincia ? ubicacion : ''}</Caption>
        <Caption>{obraSocial ? `${obraSocial} - ${numeroAfiliado}` : ''}</Caption>
      </View>
      <View style={{marginLeft: 'auto'}}>
        <IconButton
          icon="eye-outline" mode="text"
          color={colors.primary}
          onPress={onPacienteDetailClick}
        />
        <IconButton
          icon="account-group" mode="text"
          color={colors.primary}
          onPress={onMisPacientesPress}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center'
  },
});

export default withTheme(PacienteCard);
