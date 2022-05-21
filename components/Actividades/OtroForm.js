import React, { useEffect, useRef, useState } from 'react'
import { StyleSheet, View } from 'react-native';
import { Button, Switch, Text, TextInput, withTheme } from 'react-native-paper';
import FechaPicker from '../FechaPicker';
import DropDown from "react-native-paper-dropdown";

const axios = require('axios').default;

function OtroForm({ actividadId, waitingResponse, onCancel, onSubmit, ...props }) {

  const { colors } = props.theme;

  const [nombre, setNombre] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [direccion, setDireccion] = useState('');
  const [repeticiones, setRepeticiones] = useState(false);
  const [duracion, setDuracion] = useState('');
  const [frecuencia, setFrecuencia] = useState('');
  const [dias, setDias] = useState('');
  const [listaDias, setListaDias] = useState([]);
  const [fecha, setFecha] = useState(new Date());

  const [showMultiSelectDropDown, setShowMultiSelectDropDown] = useState(false);
  
  const observacionesTextInput = useRef();
  const frecuenciaTextInput = useRef();

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(`/api/dias`);
      setListaDias(response.data.dia.map(d => ({label: d.descripcion, value: d.id})));
      if(actividadId) {
        const response = await axios.get(`/api/actividads/${actividadId}`);
        const {
          nombre,
          observaciones,
          direccion,
          repeticiones,
          duracion,
          frecuencia,
          dias,
          fecha,
        } = response.data.actividad;
        setNombre(nombre);
        setObservaciones(observaciones);
        setDireccion(direccion);
        setRepeticiones(repeticiones);
        setDuracion(String(duracion));
        setFrecuencia(String(frecuencia));
        setDias(`,${dias.join(",")}`);
        setFecha(new Date(fecha));
      }
    }

    fetchData()
      .catch(console.error)
  }, []);

  function handleSwitchChange() {
    setRepeticiones(!repeticiones);
  }

  function handleSubmit() {
    onSubmit({
      nombre,
      observaciones,
      direccion,
      repeticiones,
      fecha,
      duracion: Number(duracion),
      frecuencia: Number(frecuencia),
      dias: dias.split(",").slice(1).map(id => Number(id)),
      tipo: 'Otro',
    });
  }

  return (
    <>
    <TextInput
      style={{backgroundColor: 'transparent'}}
      mode='flat'
      label='Nombre de la Actividad'
      value={nombre}
      blurOnSubmit={true}
      returnKeyType="next"
      onChangeText={setNombre}
    />
    <FechaPicker
      label="Fecha"
      fecha={fecha}
      onChange={setFecha}
    />
    <TextInput
      style={{backgroundColor: 'transparent'}}
      mode='flat'
      label='Dirección'
      value={direccion}
      placeholder="Lima 775"
      blurOnSubmit={false}
      returnKeyType="next"
      onSubmitEditing={() => {
        observacionesTextInput.current.focus();
      }}
      onChangeText={setDireccion}
    />
    <TextInput
      style={{backgroundColor: 'transparent'}}
      mode='flat'
      label='Observaciones'
      value={observaciones}
      placeholder="Llevar carnet de Obra Social"
      blurOnSubmit={true}
      returnKeyType="send"
      ref={observacionesTextInput}
      onChangeText={setObservaciones}
    />
    <View style={styles.switch}>
      <Text>REPETICIONES</Text>
      <Switch
        color={colors.primary}
        value={repeticiones}
        onValueChange={handleSwitchChange}
      />
    </View>
    {/* Si hay repeticiones mostrar lo siguiente: */}
    {!repeticiones ? null : (
    <>
      <TextInput
        style={{ backgroundColor: 'transparent' }}
        mode='flat'
        label='Duración (en días)'
        value={duracion}
        placeholder="30"
        blurOnSubmit={false}
        returnKeyType="next"
        onSubmitEditing={() => {
          frecuenciaTextInput.current.focus();
        }}
        onChangeText={setDuracion}
        keyboardType="number-pad"
      />
      <TextInput
        style={{ backgroundColor: 'transparent' }}
        mode='flat'
        label='Frecuencia (en horas)'
        value={frecuencia}
        placeholder="24"
        blurOnSubmit={true}
        returnKeyType="next"
        ref={frecuenciaTextInput}
        onSubmitEditing={() => {
          setShowMultiSelectDropDown(true);
        }}
        onChangeText={setFrecuencia}
        keyboardType="number-pad"
      />
      <DropDown
        label={"Días"}
        mode={"flat"}
        visible={showMultiSelectDropDown}
        showDropDown={() => setShowMultiSelectDropDown(true)}
        onDismiss={() => setShowMultiSelectDropDown(false)}
        value={dias}
        setValue={setDias}
        list={listaDias}
        multiSelect
        inputProps={{ style: { backgroundColor: 'transparent' } }}
      />
    </>
    )
    }
    <View style={styles.bottomView}>
      <Button
        mode='outlined'
        onPress={onCancel}
      >
        Cancelar
      </Button>
      <Button
        mode='contained'
        onPress={handleSubmit}
        loading={waitingResponse}
        disabled={waitingResponse}
      >
        {actividadId ? 'Modificar' : 'Crear'} Actividad
      </Button>
    </View>
    </>
  )
}

const styles = StyleSheet.create({
  bottomView: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  switch: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  }
});

export default withTheme(OtroForm);
