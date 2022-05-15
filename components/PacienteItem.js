import { Alert, StyleSheet } from 'react-native';
import { Avatar, List, withTheme } from 'react-native-paper';

function PacienteItem({ paciente, ...props }) {
  const { id, nombre, ubicacion, imagen} = paciente;
  const isSelected = id === 1;
  const { colors } = props.theme;

  const iconColor = isSelected ? colors.primary : colors.disabled;
  const icon = isSelected ? 'checkbox-marked-circle' : 'checkbox-blank-circle-outline';

  return (
    <List.Item
      style={styles.row}
      title={nombre}
      description={ubicacion}
      left={() => <Avatar.Image source={imagen}/>}
      right={() =>
      <List.Icon
        color={iconColor}
        icon={icon}
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
