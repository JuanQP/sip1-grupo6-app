import { Alert, StyleSheet } from 'react-native';
import { Avatar, List, withTheme } from 'react-native-paper';

function PacienteItem({ paciente, ...props }) {
  const { id, nombre, ubicacion, imagen} = paciente;
  const isSelected = id === 1;
  const { colors } = props.theme;

  return (
    <List.Item
      style={styles.row}
      title={nombre}
      description={ubicacion}
      left={() => <Avatar.Image source={imagen}/>}
      right={() =>
      <List.Icon
        color={isSelected ? colors.primary : colors.disabled}
        icon={isSelected ? 'checkbox-marked-circle' : 'checkbox-blank-circle-outline'}
      />}
      onPress={() => Alert.alert(`Paciente clickeado`, JSON.stringify(paciente))}
    />
  )
}

const styles = StyleSheet.create({
  row: {
    borderColor: 'whitesmoke',
    borderBottomWidth: 1,
  },
});

export default withTheme(PacienteItem);
