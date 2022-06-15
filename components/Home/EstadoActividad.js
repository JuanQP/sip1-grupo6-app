import { StyleSheet, View } from 'react-native';
import { Text, Title } from 'react-native-paper';

export default function EstadoActividad({ titulo, actividades, color }) {
  const cantidad = actividades.reduce((acc, a) => {
    return a.estado === titulo.slice(0, -1).toLowerCase() ? acc + 1 : acc;
  }, 0);

  return (
    <View style={{ ...styles.row, borderBottomColor: color }}>
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
