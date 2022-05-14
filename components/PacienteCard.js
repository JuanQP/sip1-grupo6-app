import { View } from 'react-native';
import { Avatar, Caption, IconButton, Text } from 'react-native-paper';

export default function PacienteCard({ paciente }) {
  const { nombre, edad, ubicacion, obraSocial, numeroObraSocial, imagen } = paciente;
  return (
    <View style={{flexDirection: 'row', backgroundColor: '#FFF', padding: 10}}>
      <Avatar.Image size={64} source={imagen} />
      <View style={{marginLeft: 10}}>
        <Text>{`${nombre}, ${edad}`}</Text>
        <Caption>{ubicacion}</Caption>
        <Caption>{`${obraSocial} - ${numeroObraSocial}`}</Caption>
      </View>
      <IconButton
        style={{marginLeft: 'auto'}}
        icon="dots-horizontal" mode="text"
        onPress={() => {}}
      />
    </View>
  )
}
