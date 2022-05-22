import { Alert, StyleSheet } from 'react-native';
import { IconButton, List, withTheme } from 'react-native-paper';

function FamiliarItem({ familiar, onEditFamiliar, ...props }) {
  const {
    nombre,
    relacion,
    esContactoDeEmergencia,
    provincia,
    localidad,
  } = familiar;
  const isSelected = esContactoDeEmergencia;
  const { colors } = props.theme;

  const iconColor = isSelected ? colors.primary : colors.disabled;
  const icon = isSelected ? 'phone-check' : 'phone';

  function handleEditFamiliarClick() {
    onEditFamiliar(familiar);
  }

  return (
    <List.Item
      style={styles.row}
      title={`${nombre}, ${relacion}`}
      description={`${localidad}, ${provincia.descripcion}`}
      left={() =>
      <IconButton
        color={colors.primary}
        icon="pencil"
        onPress={handleEditFamiliarClick}
      />}
      right={() =>
      <IconButton
        color={iconColor}
        icon={icon}
        onPress={() => {}}
      />}
      onPress={() => Alert.alert(`Familiar clickeado`, JSON.stringify(familiar))}
    />
  )
}

const styles = StyleSheet.create({
  row: {
    borderColor: 'whitesmoke',
    borderBottomWidth: 1,
  },
});

export default withTheme(FamiliarItem);
