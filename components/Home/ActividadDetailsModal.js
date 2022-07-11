import { StyleSheet, View } from "react-native";
import { Avatar, Button, Caption, IconButton, Modal, Paragraph, Text, TextInput, TouchableRipple, withTheme } from "react-native-paper"
import { useEffect, useState } from "react";
import { formatearFecha } from "../../utils/utils";
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
              <Avatar.Image
                size={64}
                source={{uri: actividad.paciente.imagen}}
              />
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
        <View style={{flexDirection: 'row', flexGrow: 1}}>
          <TouchableRipple
            style={{
              flex: 1,
              alignItems: 'center',
              backgroundColor: estado === 'Pospuesta' ? colors.primary : undefined,
            }}
            onPress={() => {setEstado('Pospuesta')}}
            rippleColor="rgba(0, 0, 0, .33)"
          >
            <View style={{alignItems: 'center'}}>
              <Avatar.Icon
                icon="alert-circle-outline"
                size={48}
                color={estado === 'Pospuesta' ? undefined : colors.primary}
                style={{
                  backgroundColor: 'transparent',
                  margin: 0,
                }}
              />
              <Text style={{color: estado === 'Pospuesta' ? 'white' : colors.primary }}>
                Pospuesta
              </Text>
            </View>
          </TouchableRipple>
          <TouchableRipple
            style={{
              flex: 1,
              alignItems: 'center',
              backgroundColor: estado === 'Pendiente' ? colors.primary : undefined,
            }}
            onPress={() => {setEstado('Pendiente')}}
            rippleColor="rgba(0, 0, 0, .33)"
          >
            <View style={{alignItems: 'center'}}>
              <Avatar.Icon
                icon="clock-outline"
                size={48}
                color={estado === 'Pendiente' ? undefined : colors.primary}
                style={{
                  backgroundColor: 'transparent',
                  margin: 0,
                }}
              />
              <Text style={{color: estado === 'Pendiente' ? 'white' : colors.primary }}>
                Pendiente
              </Text>
            </View>
          </TouchableRipple>
          <TouchableRipple
            style={{
              flex: 1,
              alignItems: 'center',
              backgroundColor: estado === 'Completada' ? colors.primary : undefined,
            }}
            onPress={() => {setEstado('Completada')}}
            rippleColor="rgba(0, 0, 0, .33)"
          >
            <View style={{alignItems: 'center'}}>
              <Avatar.Icon
                icon="check-circle-outline"
                size={48}
                color={estado === 'Completada' ? undefined : colors.primary}
                style={{
                  backgroundColor: 'transparent',
                  margin: 0,
                }}
              />
              <Text style={{color: estado === 'Completada' ? 'white' : colors.primary }}>
                Completada
              </Text>
            </View>
          </TouchableRipple>
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
