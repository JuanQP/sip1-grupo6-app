import React, { useEffect, useRef, useState } from 'react'
import { StyleSheet, View } from 'react-native';
import { Button, Checkbox, Text, TextInput, withTheme } from 'react-native-paper';
import DropDown from 'react-native-paper-dropdown';
import { mapToLabelValue } from "../../utils/utils";

const axios = require('axios').default;

function FamiliarForm({ familiar, waitingResponse, onChange, onCancel, onSubmit, ...props }) {

  const { colors } = props.theme;
  const [showProvinciasDropDown, setShowProvinciasDropDown] = useState(false);
  const [listaProvincias, setListaProvincias] = useState([]);  
  const relacionTextInput = useRef();
  const telefonoTextInput = useRef();

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(`/api/provincias/`);
      setListaProvincias(response.data.provincia.map(p => mapToLabelValue(p)));
    }
    fetchData()
      .catch(console.error)
  }, []);

  function handleNombreChange(nombre) {
    onChange('nombre', nombre);
  }
  function handleRelacionChange(relacion) {
    onChange('relacion', relacion);
  }
  function handleProvinciaChange(provinciaId) {
    onChange('provinciaId', provinciaId);
  }
  function handleLocalidadChange(localidad) {
    onChange('localidad', localidad );
  }
  function handleTelefonoChange(telefono) {
    onChange('telefono', telefono);
  }
  function handleContactoEmergenciaChange() {
    onChange('esContactoDeEmergencia', !familiar.esContactoDeEmergencia);
  }

  function handleShowDropDown() {
    setShowProvinciasDropDown(true);
  }

  function handleDismissDropDown() {
    setShowProvinciasDropDown(false);
  }

  return (
    <View>
      <TextInput
        style={{backgroundColor: 'transparent'}}
        mode='flat'
        label='Nombre'
        value={familiar.nombre}
        placeholder="Juan Pérez"
        blurOnSubmit={true}
        returnKeyType="next"
        onChangeText={handleNombreChange}
        onSubmitEditing={() => relacionTextInput.current.focus()}
      />
      <TextInput
        style={{backgroundColor: 'transparent'}}
        mode='flat'
        label='Relación'
        value={familiar.relacion}
        placeholder="Hijo, Hija, Esposo..."
        blurOnSubmit={true}
        returnKeyType="next"
        onChangeText={handleRelacionChange}
        ref={relacionTextInput}
      />
      <DropDown
        label={"Provincia"}
        mode={"flat"}
        visible={showProvinciasDropDown}
        showDropDown={handleShowDropDown}
        onDismiss={handleDismissDropDown}
        value={familiar.provinciaId}
        setValue={handleProvinciaChange}
        list={listaProvincias}
        dropDownStyle={{ flex: 1}}
        inputProps={{ style: { backgroundColor: 'transparent' } }}
      />
      <TextInput
        style={{backgroundColor: 'transparent'}}
        mode='flat'
        label='Localidad'
        value={familiar.localidad}
        placeholder="Tigre, Pilar..."
        blurOnSubmit={true}
        returnKeyType="next"
        onChangeText={handleLocalidadChange}
        onSubmitEditing={() => telefonoTextInput.current.focus()}
      />
      <TextInput
        style={{backgroundColor: 'transparent'}}
        mode='flat'
        label='Teléfono'
        value={familiar.telefono}
        placeholder="1122334455"
        blurOnSubmit={true}
        returnKeyType="next"
        onChangeText={handleTelefonoChange}
        keyboardType="number-pad"
        ref={telefonoTextInput}
      />
      <View style={styles.checkbox}>
        <Text>CONTACTO DE EMERGENCIA?</Text>
        <Checkbox
          color={colors.primary}
          status={familiar.esContactoDeEmergencia ? 'checked' : 'unchecked'}
          onPress={handleContactoEmergenciaChange}
        />
      </View>
      <View style={styles.bottomView}>
        <Button
          mode='outlined'
          onPress={onCancel}
        >
          Cancelar
        </Button>
        <Button
          mode='contained'
          onPress={onSubmit}
          loading={waitingResponse}
          disabled={waitingResponse}
        >
          {familiar.id ? 'Modificar' : 'Crear'} Familiar
        </Button>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  bottomView: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  checkbox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 20,
  }
});

export default withTheme(FamiliarForm);
