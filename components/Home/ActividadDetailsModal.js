import { StyleSheet, View } from "react-native";
import { Button, Caption, IconButton, Modal, Paragraph, Text, ToggleButton, withTheme } from "react-native-paper"
import { useEffect, useState } from "react";
import { formatearFecha } from "../../utils/utils";
import moment from "moment";

function ActividadDetailsModal({ actividad, waiting, visible, onEditClick, onDismiss, onSubmit, ...props }) {

  if(!actividad) {
    return null;
  }

  const [estado, setEstado] = useState('');
  const { colors } = props.theme;
  const modalStyles = {
    margin: 20,
    backgroundColor: colors.surface,
    borderRadius: 10,
  };

  const fecha = moment(actividad.fecha);

  useEffect(() => {
    if(actividad) {
      setEstado(actividad.estado);
    }
  }, [actividad]);

  function handleConfirmarClick() {
    onSubmit({
      ...actividad,
      estado,
    });
  }

  function handleEditClick() {
    onEditClick(actividad.id);
  }

  return (
    <Modal
      contentContainerStyle={modalStyles}
      visible={visible}
      onDismiss={onDismiss}
    >
      <View style={{...styles.header, borderColor: colors.disabled}}>
        <Button
          color={colors.accent}
          mode="text"
          onPress={onDismiss}
          disabled={waiting}
        >
          Cancelar
        </Button>
        <Button
          mode="text"
          onPress={handleConfirmarClick}
          disabled={waiting}
          loading={waiting}
        >
          Confirmar
        </Button>
      </View>
      <View style={styles.contenido}>
        <Text style={{alignSelf: "center"}}>
          {formatearFecha(fecha)}
        </Text>
        <View style={{flexDirection: 'column'}}>
          <View style={styles.contenidoRow}>
            <Text>{actividad.nombre}</Text>
            <IconButton
              color={colors.primary}
              icon="pencil-outline"
              onPress={handleEditClick}
            />
          </View>
          <View style={styles.contenidoRow}>
            <Text>{fecha.format("HH:mm")}</Text>
            <Text>{actividad.dosis}</Text>
          </View>
        </View>
        <Caption>Observaciones</Caption>
        <Paragraph>{actividad.observaciones}</Paragraph>
      </View>
      <View>
        <ToggleButton.Row onValueChange={setEstado} value={estado}>
          <ToggleButton
            color={colors.primary}
            style={{flex: 1}}
            icon="check-circle-outline"
            value="completada"
          />
          <ToggleButton
            color={colors.primary}
            style={{flex: 1}}
            icon="clock-outline"
            value="pendiente"
            />
          <ToggleButton
            color={colors.primary}
            style={{flex: 1}}
            icon="alert-circle-outline"
            value="pospuesta"
          />
        </ToggleButton.Row>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
  },
  contenido: {
    padding: 20,
  },
  contenidoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

export default withTheme(ActividadDetailsModal);
