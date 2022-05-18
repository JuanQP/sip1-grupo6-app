import React, { useEffect, useRef, useState } from 'react'
import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Appbar, Button, IconButton, TextInput, Title, withTheme } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import DropDown from "react-native-paper-dropdown";
import moment from 'moment';
import ActividadCreadaModal from '../../components/ActividadCreadaModal';

const axios = require('axios').default;

function NuevaMedicacionScreen({ navigation, route, ...props }) {

  const { colors } = props.theme;
  const { pacienteId } = route.params;

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

  const [waitingResponse, setWaitingResponse] = useState(false);
  const [fetchingData, setFetchingData] = useState(true);

  const [modalVisible, setModalVisible] = useState(false);

  const observacionesTextInput = useRef();
  const dosisTextInput = useRef();
  const duracionTextInput = useRef();
  const frecuenciaTextInput = useRef();

  function handleBackActionClick() {
    navigation.goBack();
  }

  useEffect(() => {
    setFetchingData(true);
    const fetchData = async () => {
      const diasResponse = await axios.get(`/api/dias`);
      setFetchingData(false);
      setListaDias(diasResponse.data.dia.map(d => ({label: d.descripcion, value: d.id})));
    }

    fetchData()
      .catch(console.error)
      .finally(() => setFetchingData(false));
  }, []);

  async function handleSubmit() {
    setWaitingResponse(true);
    // Simulamos una espera de 2 segundos...
    await new Promise(r => setTimeout(r, 2000));
    setWaitingResponse(false);
    setModalVisible(true);
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

  function hideModal() {
    setModalVisible(false);
    navigation.navigate('Home', { pacienteId });
  }

  if(fetchingData) {
    return null;
  }

  return (
    <View style={{...styles.container, backgroundColor: colors.surface}}>
      <Appbar.Header>
        <Appbar.BackAction onPress={handleBackActionClick} />
        <Appbar.Content title="Nueva Medicación" />
      </Appbar.Header>
      {/* Formulario */}
      <View style={styles.formContainer}>
        <ScrollView>
          <Title>Mirta Pérez</Title>
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
              onPress={handleBackActionClick}
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
        </ScrollView>
      </View>
      <StatusBar style="auto" />
      <ActividadCreadaModal
        visible={modalVisible}
        onDismiss={hideModal}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  formContainer: {
    padding: 20,
    marginBottom: 60,
    justifyContent: 'center',
  },
  bottomView: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default withTheme(NuevaMedicacionScreen);
