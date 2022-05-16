import React, { useRef, useState } from 'react'
import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Appbar, Button, IconButton, Switch, Text, TextInput, Title, withTheme } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import DropDown from "react-native-paper-dropdown";
import ActividadCreadaModal from '../../components/ActividadCreadaModal';
import { listaDias } from '../../utils/utils';

function NuevoOtroScreen({ navigation, ...props }) {

  const { colors } = props.theme;

  const [nombre, setNombre] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [direccion, setDireccion] = useState('');
  const [repeticiones, setRepeticiones] = useState(false);
  const [duracion, setDuracion] = useState('');
  const [frecuencia, setFrecuencia] = useState('');
  const [dias, setDias] = useState('');

  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showMultiSelectDropDown, setShowMultiSelectDropDown] = useState(false);

  const [waitingResponse, setWaitingResponse] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);

  const observacionesTextInput = useRef();
  const frecuenciaTextInput = useRef();

  function handleBackActionClick() {
    navigation.goBack();
  }

  function handleSwitchChange() {
    setRepeticiones(!repeticiones);
  }

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
    navigation.navigate('Home');
  }

  return (
    <View style={{...styles.container, backgroundColor: colors.surface}}>
      <Appbar.Header>
        <Appbar.BackAction onPress={handleBackActionClick} />
        <Appbar.Content title="Otro tipo de actividad" />
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
  switch: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  }
});

export default withTheme(NuevoOtroScreen);
