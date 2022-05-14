import { Alert, StyleSheet, View } from 'react-native';
import { Caption, IconButton, Text, Title } from 'react-native-paper';

function colorSegunTipo(tipo) {
  switch (tipo.toLowerCase()) {
    case 'completada':
      return "#07ACB9";
    case 'pendiente':
      return "#ffeb6a";
    case 'pospuesta':
      return "#f87575";
    default:
      break;
  }
}

/**
 * El tipo de fecha debe ser Moment
 */
export default function ActividadRow({ actividad }) {
  const { fecha, descripcion, tipo} = actividad;
  const diaDelMes = fecha.format("DD");
  const nombreDelDia = fecha.format("ddd").toUpperCase().replace(".", "");
  const hora = fecha.format("HH:mm");
  const color = colorSegunTipo(tipo);

  function onActividadClick() {
    Alert.alert(`Actividad clickeada`, JSON.stringify(actividad))
  }

  return (
    <View style={styles.row}>
      <View style={styles.date}>
        <Title>{diaDelMes}</Title>
        <Caption>{nombreDelDia}</Caption>
      </View>
      <View style={{...styles.card, borderColor: color}}>
        <View style={{flexDirection: 'row'}}>
          <Text>{descripcion}</Text>
          <IconButton
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
    backgroundColor: 'white',
    padding: 10
  },
});
