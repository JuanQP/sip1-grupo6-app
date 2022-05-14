import { View } from 'react-native';
import { Text, Title } from 'react-native-paper';

export default function EstadoActividad({ titulo, cantidad, color }) {
  return (
    <View style={{alignItems: 'center', borderBottomWidth: 1, borderBottomColor: color}}>
      <Title>{cantidad}</Title>
      <Text>{titulo}</Text>
    </View>
  )
}
