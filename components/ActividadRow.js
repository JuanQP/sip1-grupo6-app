import { Alert, StyleSheet, View } from 'react-native';
import { Caption, IconButton, Text, Title, withTheme } from 'react-native-paper';

function colorSegunTipo(tipo, colors) {
  switch (tipo.toLowerCase()) {
    case 'completada':
      return colors.primary;
    case 'pendiente':
      return colors.pendiente;
    case 'pospuesta':
      return colors.pospuesta;
    default:
      break;
  }
}

/**
 * El tipo de fecha debe ser Moment
 */
function ActividadRow({ actividad, ...props }) {
  const { fecha, descripcion, tipo} = actividad;
  const diaDelMes = fecha.format("DD");
  const nombreDelDia = fecha.format("ddd").toUpperCase().replace(".", "");
  const hora = fecha.format("HH:mm");
  const { colors } = props.theme;
  const color = colorSegunTipo(tipo, colors);

  function onActividadClick() {
    Alert.alert(`Actividad clickeada`, JSON.stringify(actividad))
  }

  return (
    <View style={styles.row}>
      <View style={styles.date}>
        <Title>{diaDelMes}</Title>
        <Caption>{nombreDelDia}</Caption>
      </View>
      <View style={{...styles.card, backgroundColor: colors.surface, borderColor: color}}>
        <View style={{flexDirection: 'row'}}>
          <Text>{descripcion}</Text>
          <IconButton
            color={colors.primary}
            style={{marginLeft: 'auto'}}
            icon="dots-horizontal" mode="text"
            onPress={onActividadClick}
          />
        </View>
        <View style={{flexDirection: 'row'}}>
          <Text>{hora}</Text>
          <Text></Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  date: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center'
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  card: {
    flex: 6,
    borderLeftWidth: 4,
    flexDirection: 'column',
    padding: 10
  },
});


export default withTheme(ActividadRow);
