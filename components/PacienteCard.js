import { StyleSheet, View } from 'react-native';
import { Avatar, Caption, IconButton, Text, withTheme } from 'react-native-paper';

function PacienteCard({ paciente, ...props }) {

  const { nombre, edad, ubicacion, obraSocial, numeroObraSocial, imagen } = paciente;
  const { colors } = props.theme;

  return (
    <View style={{ ...styles.card, backgroundColor: colors.surface }}>
      <Avatar.Image size={64} source={imagen} />
      <View style={{marginLeft: 10}}>
        <Text>{`${nombre}, ${edad}`}</Text>
        <Caption>{ubicacion}</Caption>
        <Caption>{`${obraSocial} - ${numeroObraSocial}`}</Caption>
      </View>
      <IconButton
        style={{marginLeft: 'auto'}}
        icon="dots-horizontal" mode="text"
        color={colors.primary}
        onPress={() => {}}
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
