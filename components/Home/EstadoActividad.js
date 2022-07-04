import { StyleSheet, View } from 'react-native';
import { Text, Title } from 'react-native-paper';
import { bordeSegunEstado } from '../../utils/styles';

export default function EstadoActividad({ titulo, actividades, color }) {
  const cantidad = actividades.reduce((acc, a) => {
    return a.status.toLowerCase() === titulo.slice(0, -1).toLowerCase() ? acc + 1 : acc;
  }, 0);
  const borderStyle = {
    borderStyle: bordeSegunEstado(titulo.slice(0, -1)),
  };

  return (
    <View style={{ ...styles.row, ...borderStyle, borderBottomColor: color }}>
      <Title>{cantidad}</Title>
      <Text>{titulo}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    alignItems: 'center',
    borderBottomWidth: 4,
  },
});
