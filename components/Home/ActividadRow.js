import { StyleSheet, View } from 'react-native';
import { Caption, IconButton, Text, Title, withTheme } from 'react-native-paper';
import moment from 'moment';

function iconSegunTipo(tipo) {
  switch (tipo.toLowerCase()) {
    case 'medicación':
      return 'pill';
    case 'estudio médico':
      return 'hospital-building';
    case 'consulta médica':
      return 'doctor';
    case 'otro':
      return 'dots-horizontal';
    default:
      break;
  }
}

function colorSegunEstado(estado, colors) {
  switch (estado.toLowerCase()) {
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
function ActividadRow({ actividad, onActividadClick, ...props }) {
  const { nombre, estado } = actividad;
  const fecha = moment(actividad.fecha);
  const diaDelMes = fecha.format("DD");
  const nombreDelDia = fecha.format("ddd").toUpperCase().replace(".", "");
  const hora = fecha.format("HH:mm");
  const { colors } = props.theme;
  const color = colorSegunEstado(estado, colors);

  function handleIconButtonClick() {
    onActividadClick(actividad);
  }

  return (
    <View style={styles.row}>
      <View style={styles.date}>
        <Title>{diaDelMes}</Title>
        <Caption>{nombreDelDia}</Caption>
      </View>
      <View style={{...styles.card, backgroundColor: colors.surface, borderColor: color}}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text>{nombre}</Text>
          <IconButton
            color={colors.primary}
            style={{marginLeft: 'auto'}}
            icon="dots-horizontal"
            mode="text"
            onPress={handleIconButtonClick}
          />
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text>{hora}</Text>
          <IconButton
            color={colors.disabled}
            style={{marginLeft: 'auto'}}
            icon={iconSegunTipo(actividad.tipo)}
            mode="text"
          />
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
