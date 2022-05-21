import React, { useEffect, useRef, useState } from 'react'
import { StyleSheet, View } from 'react-native';
import { Button, TextInput, withTheme } from 'react-native-paper';
import DropDown from "react-native-paper-dropdown";
import FechaPicker from "../FechaPicker";

const axios = require('axios').default;

function MedicacionForm({ actividadId, waitingResponse, onCancel, onSubmit }) {

  const [nombre, setNombre] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [dosis, setDosis] = useState('');
  const [duracion, setDuracion] = useState('');
  const [frecuencia, setFrecuencia] = useState('');
  const [dias, setDias] = useState('');
  const [listaDias, setListaDias] = useState([]);
  const [fecha, setFecha] = useState(new Date());
  
  const [showMultiSelectDropDown, setShowMultiSelectDropDown] = useState(false);
  
  const observacionesTextInput = useRef();
  const dosisTextInput = useRef();
  const duracionTextInput = useRef();
  const frecuenciaTextInput = useRef();

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(`/api/dias`);
      if(actividadId) {
        const response = await axios.get(`/api/actividads/${actividadId}`);
        const { nombre, observaciones, dosis, duracion, frecuencia, dias, fecha } = response.data.actividad;
        setNombre(nombre);
        setObservaciones(observaciones);
        setDosis(dosis);
        setDuracion(String(duracion));
        setFrecuencia(String(frecuencia));
        setDias(`,${dias.join(",")}`);
        setFecha(new Date(fecha));
      }
      setListaDias(response.data.dia.map(d => ({label: d.descripcion, value: d.id})));
    }

    fetchData()
      .catch(console.error)
  }, []);

  function handleSubmit() {
    onSubmit({
      nombre,
      observaciones,
      dosis,
      fecha,
      duracion: Number(duracion),
      frecuencia: Number(frecuencia),
      tipo: 'Medicación',
      dias: dias.split(",").slice(1).map(id => Number(id)),
    });
  }

  return (
    <>
    <TextInput
      style={{backgroundColor: 'transparent'}}
      mode='flat'
      label='Nombre de la Actividad'
      value={nombre}
      placeholder="Omeprazol"
      blurOnSubmit={false}
      onSubmitEditing={() => {
        observacionesTextInput.current.focus();
      }}
      returnKeyType="next"
      onChangeText={setNombre}
    />
    <TextInput
      style={{backgroundColor: 'transparent'}}
      mode='flat'
      label='Observaciones'
      value={observaciones}
      placeholder="Debe ingerir alimentos antes..."
      blurOnSubmit={true}
      onSubmitEditing={() => {
        dosisTextInput.current.focus();
      }}
      returnKeyType="next"
      ref={observacionesTextInput}
      onChangeText={setObservaciones}
    />
    <TextInput
      style={{backgroundColor: 'transparent'}}
      mode='flat'
      label='Dósis'
      value={dosis}
      placeholder="25 mg"
      blurOnSubmit={true}
      returnKeyType="next"
      ref={dosisTextInput}
      onChangeText={setDosis}
    />
    <FechaPicker
      label="Fecha de Inicio"
      fecha={fecha}
      onChange={setFecha}
    />
    <TextInput
      style={{backgroundColor: 'transparent'}}
      mode='flat'
      label='Duración (en días)'
      value={duracion}
      placeholder="30"
      blurOnSubmit={false}
      returnKeyType="next"
      ref={duracionTextInput}
      onSubmitEditing={() => {
        frecuenciaTextInput.current.focus();
      }}
      onChangeText={setDuracion}
      keyboardType="number-pad"
    />
    <TextInput
      style={{backgroundColor: 'transparent'}}
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
      inputProps={{style: {backgroundColor: 'transparent'}}}
    />
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
});

export default withTheme(MedicacionForm);
