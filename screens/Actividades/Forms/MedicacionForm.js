import React, { useEffect, useRef, useState } from 'react'
import { StyleSheet, View } from 'react-native';
import { Button, IconButton, TextInput, withTheme } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import DropDown from "react-native-paper-dropdown";
import moment from 'moment';

const axios = require('axios').default;

function MedicacionForm({ actividadId, waitingResponse, onCancel, onSubmit, ...props }) {

  const { colors } = props.theme;

  const [nombre, setNombre] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [dosis, setDosis] = useState('');
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
        setDate(new Date(fecha));
        setTime(new Date(fecha));
      }
      setListaDias(response.data.dia.map(d => ({label: d.descripcion, value: d.id})));
    }

    fetchData()
      .catch(console.error)
  }, []);

  function handleSubmit() {
    const fecha = new Date(date);
    fecha.setHours(time.getHours());
    fecha.setMinutes(time.getMinutes());

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

  function handleBackActionClick() {

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
        label='Fecha de Inicio'
        value={moment(date).set({hour: time.getHours(), minute: time.getMinutes()}).format("DD/MM/YYYY HH:mm")}
        placeholder="14/10/1991 22:00"
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
