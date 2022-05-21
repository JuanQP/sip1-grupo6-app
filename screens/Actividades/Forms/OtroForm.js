import React, { useEffect, useRef, useState } from 'react'
import { StyleSheet, View } from 'react-native';
import { Button, IconButton, Switch, Text, TextInput, withTheme } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import DropDown from "react-native-paper-dropdown";
import moment from 'moment';

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

  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
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
        setDate(new Date(fecha));
        setTime(new Date(fecha));
      }
    }

    fetchData()
      .catch(console.error)
  }, []);

  function handleSwitchChange() {
    setRepeticiones(!repeticiones);
  }

  function onDateChange (event, selectedDate) {
    setShowDatePicker(false);
    if(event.type === "dismissed")
      return;
    setDate(selectedDate);
    setShowTimePicker(true);
  };

  function onTimeChange (event, selectedTime) {
    setShowTimePicker(false);
    if(event.type === "dismissed")
      return;
    setTime(selectedTime);
  };

  function beginDatePicker() {
    hideAllCalendars();
    setShowDatePicker(true);
  }

  function hideAllCalendars() {
    setShowDatePicker(false);
    setShowTimePicker(false);
  }

  function handleSubmit() {
    const fecha = new Date(date);
    fecha.setHours(time.getHours());
    fecha.setMinutes(time.getMinutes());

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
    {/* DateTime Picker */}
    <View style={{flexDirection: "row", alignItems: "center"}}>
      <IconButton
        color={colors.primary}
        icon="calendar"
        onPress={beginDatePicker}
      />
      <TextInput
        style={{backgroundColor: 'transparent'}}
        mode='flat'
        label='Fecha'
        value={moment(date).set({hour: time.getHours(), minute: time.getMinutes()}).format("DD/MM/YYYY HH:mm")}
        placeholder="14/10/2022 16:00"
        disabled
      />
      {(showDatePicker && <DateTimePicker
        testID="datePicker"
        value={date}
        mode={"date"}
        onChange={onDateChange}
      />)}
      {(showTimePicker && <DateTimePicker
        testID="timePicker"
        value={time}
        mode={"time"}
        onChange={onTimeChange}
        is24Hour
      />)}
    </View>
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
        Crear Actividad
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
