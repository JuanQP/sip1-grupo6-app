import { StyleSheet, View } from "react-native";
import { Avatar, Button, Caption, IconButton, Modal, Paragraph, Text, TextInput, ToggleButton, withTheme } from "react-native-paper"
import { useEffect, useState } from "react";
import { formatearFecha, imagenes } from "../../utils/utils";
import moment from "moment";
import * as ImagePicker from 'expo-image-picker';

const pickImage = async () => {
  // No permissions request is necessary for launching the image library
  const result = await ImagePicker.launchCameraAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    quality: 1,
  });
  return result.cancelled ? undefined : result.uri;
};

function ActividadDetailsModal({
  actividad,
  waiting,
  visible,
  mostrarPaciente,
  readOnly,
  onEditClick,
  onDismiss,
  onSubmit,
  ...props
}) {

  if(!actividad) {
    return null;
  }

  const [estado, setEstado] = useState('');
  const [nota, setNota] = useState('');
  const [archivo, setArchivo] = useState(undefined);
  const handleValueChange = (newValue) => {
    if(newValue === null) return;
    setEstado(newValue);
  };
  const { colors } = props.theme;
  const modalStyles = {
    margin: 20,
    backgroundColor: colors.surface,
    borderRadius: 10,
  };
  const mostrarDosis = actividad.tipo === 'Medicación';
  const fecha = moment(actividad.fecha);

  useEffect(() => {
    if(actividad) {
      setEstado(actividad.status);
      setNota(actividad.notas);
    }
  }, [actividad]);

  function handleConfirmarClick() {
    const fd = new FormData();
    fd.append("id", actividad.id)
    fd.append("status", estado);
    fd.append("notas", nota);
    if(archivo) {
      const uriParts = archivo.split('.');
      const fileType = uriParts[uriParts.length - 1];
      fd.append("archivo", {
        uri: archivo,
        type: `image/${fileType}`,
        name: `photo.${fileType}`,
      });
    }
    onSubmit(fd);
  }

  function handleEditClick() {
    onEditClick(actividad);
  }

  async function handleCargarArchivoPress() {
    const imagenSeleccionada = await pickImage();
    setArchivo(imagenSeleccionada);
  }

  return (
    <>
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
          {!readOnly && (
            <Button
              mode="text"
              onPress={handleConfirmarClick}
              disabled={waiting}
              loading={waiting}
            >
              Confirmar
            </Button>
          )}
        </View>
        <View style={styles.contenido}>
          <Text style={{alignSelf: "center"}}>
            {formatearFecha(fecha)}
          </Text>
          {mostrarPaciente && (
            <View style={{flexDirection: 'column', alignItems: 'center', marginTop: 10}}>
              <Avatar.Image size={64} source={imagenes[actividad.paciente.imagen]} />
              <Text>{actividad.paciente.nombre}</Text>
            </View>
          )}
          <View style={{flexDirection: 'column'}}>
            <View style={styles.contenidoRow}>
              <Text>{actividad.detalle.nombre}</Text>
              <IconButton
                color={readOnly ? colors.disabled : colors.primary}
                icon="pencil-outline"
                onPress={readOnly ? () => {} : handleEditClick}
                disabled={readOnly}
              />
            </View>
            <View style={styles.contenidoRow}>
              <Text>{fecha.format("HH:mm")}</Text>
              { mostrarDosis && <Text>{actividad.detalle.dosis}</Text>}
            </View>
          </View>
          <Caption>Observaciones</Caption>
          <Paragraph>{actividad.detalle.observaciones}</Paragraph>
          {!readOnly && (
            <TextInput
              mode="flat"
              label="Notas"
              style={{backgroundColor: 'transparent'}}
              value={nota}
              onChangeText={setNota}
            />)
          }
          {!readOnly && (
            <View>
              <Button mode="outlined" style={{marginTop: 10}} onPress={handleCargarArchivoPress}>
                {archivo ? 'Cargar otro archivo' : 'Cargar archivo'}
              </Button>
              {archivo && <Text style={{textAlign: 'center'}}>Hay un archivo seleccionado</Text>}
            </View>
          )}
        </View>
        <View>
          <ToggleButton.Row onValueChange={handleValueChange} value={estado}>
            <ToggleButton
              color={estado === 'Pospuesta' ? 'white' : colors.primary}
              style={{flex: 1, backgroundColor: estado === 'Pospuesta' ? colors.primary : 'transparent'}}
              icon="alert-circle-outline"
              value="Pospuesta"
            />
            <ToggleButton
              color={estado === 'Pendiente' ? 'white' : colors.primary}
              style={{flex: 1, backgroundColor: estado === 'Pendiente' ? colors.primary : 'transparent'}}
              icon="clock-outline"
              value="Pendiente"
            />
            <ToggleButton
              color={estado === 'Completada' ? 'white' : colors.primary}
              style={{flex: 1, backgroundColor: estado === 'Completada' ? colors.primary : 'transparent'}}
              icon="check-circle-outline"
              value="Completada"
            />
          </ToggleButton.Row>
        </View>
      </Modal>
    </>
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
