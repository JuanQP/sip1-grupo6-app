import React, { useEffect, useRef, useState } from 'react'
import { StyleSheet, View } from 'react-native';
import { Button, IconButton, TextInput, withTheme } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';

const axios = require('axios').default;

function ConsultaForm({ actividadId, waitingResponse, onCancel, onSubmit, ...props }) {

  const { colors } = props.theme;

  const [nombre, setNombre] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [direccion, setDireccion] = useState('');
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  
  const observacionesTextInput = useRef();

  useEffect(() => {
    const fetchData = async () => {
      if(actividadId) {
        const response = await axios.get(`/api/actividads/${actividadId}`);
        const { nombre, observaciones, direccion, fecha } = response.data.actividad;
        setNombre(nombre);
        setObservaciones(observaciones);
        setDireccion(direccion);
        setDate(new Date(fecha));
        setTime(new Date(fecha));
      }
    }

    fetchData()
      .catch(console.error)
  }, []);

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
      fecha,
      tipo: 'Consulta Médica',
    });
  }

  return (
    <>
    <TextInput
      style={{backgroundColor: 'transparent'}}
      mode='flat'
      label='Nombre de la Actividad'
      value={nombre}
      placeholder="Otorrinolaringología"
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
});

export default withTheme(ConsultaForm);
