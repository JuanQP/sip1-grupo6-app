import { StyleSheet, View } from 'react-native';
import { Avatar, Caption, IconButton, Text, Title, withTheme } from 'react-native-paper';
import moment from 'moment';
import { imagenes } from '../../utils/utils';
import { bordeSegunEstado } from '../../utils/styles';

function iconSegunTipo(tipo) {
  switch (tipo.toLowerCase()) {
    case 'medicación':
      return 'pill';
    case 'estudio médico':
      return 'hospital-building';
    case 'consulta médica':
      return 'doctor';
    case 'otro':
      return 'dots-horizontal';
    default:
      break;
  }
}

function colorSegunEstado(estado, colors) {
  switch (estado.toLowerCase()) {
    case 'completada':
      return colors.completada;
    case 'pendiente':
      return colors.pendiente;
    case 'pospuesta':
      return colors.pospuesta;
    default:
      break;
  }
}

/**
 * El tipo de fecha debe ser Moment
 */
function ActividadRow({ actividad, readOnly = false, mostrarPaciente = false, onActividadClick, ...props }) {
  const { nombre, estado } = actividad;
  const fecha = moment(actividad.fecha);
  const esFechaAntigua = fecha.isBefore(moment.now());
  const diaDelMes = fecha.format("DD");
  const nombreDelDia = fecha.format("ddd").toUpperCase().replace(".", "");
  const hora = fecha.format("HH:mm");
  const { colors } = props.theme;
  const color = colorSegunEstado(estado, colors);
  const mostrarDosis = actividad.tipo === 'Medicación';
  const borderStyle = {
    borderStyle: bordeSegunEstado(actividad.estado),
  };

  function handleIconButtonClick() {
    onActividadClick(actividad);
  }

  return (
    <View style={styles.row}>
      <View style={styles.date}>
        <Title style={{color: esFechaAntigua ? colors.disabled : colors.text}}>{diaDelMes}</Title>
        <Caption style={{color: esFechaAntigua ? colors.disabled : colors.text}}>{nombreDelDia}</Caption>
      </View>
      <View style={{...styles.card, ...borderStyle, backgroundColor: colors.surface, borderColor: color}}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text>{nombre}</Text>
          <IconButton
            color={colors.primary}
            style={{marginLeft: 'auto'}}
            icon={readOnly ? "eye-outline" : "square-edit-outline"}
            mode="text"
            onPress={handleIconButtonClick}
          />
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text>{hora}</Text>
          <IconButton
            color={colors.disabled}
            icon={iconSegunTipo(actividad.tipo)}
            mode="text"
          />
          {mostrarDosis && <Text>{actividad.dosis}</Text>}
        </View>
        {!mostrarPaciente ? null : (
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Avatar.Image style={{marginRight: 10}} size={32} source={imagenes[actividad.paciente.imagen]} />
            <Text>{actividad.paciente.nombre}</Text>
          </View>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  date: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center'
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  card: {
    flex: 6,
    borderTopWidth: 8,
    flexDirection: 'column',
    padding: 10
  },
});


export default withTheme(ActividadRow);
