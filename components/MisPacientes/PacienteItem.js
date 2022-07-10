import { StyleSheet } from 'react-native';
import { Avatar, List, withTheme } from 'react-native-paper';
import { imagenes } from '../../utils/utils';
import { getProvincias } from "../../utils/utils";

function PacienteItem({ paciente, isSelected, onPacienteClick, ...props }) {

  const { pacienteId, nombre, localidad, imagen} = paciente;

  const provincia = getProvincias().find(prov => prov.id == paciente.provinciaId);

  const { colors } = props.theme;

  const iconColor = isSelected ? colors.primary : colors.disabled;
  const icon = isSelected ? 'checkbox-marked-circle' : 'checkbox-blank-circle-outline';

  function handlePacienteClickeado() {
    onPacienteClick(pacienteId);
  }

  return (
    <List.Item
      style={styles.row}
      title={nombre}
      description={`${provincia.descripcion}, ${localidad}`}
      left={() => <Avatar.Image source={{uri: paciente.imagen}} />}
      right={() => <List.Icon color={iconColor} icon={icon} />}
      onPress={handlePacienteClickeado}
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
