import { StyleSheet, View } from 'react-native';
import { Text, Title } from 'react-native-paper';

export default function EstadoActividad({ titulo, cantidad, color }) {
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
    borderBottomWidth: 1,
  },
});
