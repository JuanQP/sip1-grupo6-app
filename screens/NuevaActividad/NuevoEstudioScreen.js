import React, { useRef, useState } from 'react'
import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Appbar, Button, IconButton, TextInput, Title, withTheme } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import ActividadCreadaModal from '../../components/ActividadCreadaModal';

function NuevoEstudioScreen({ navigation, route, ...props }) {

  const { colors } = props.theme;
  const { pacienteId } = route.params;

  const [nombre, setNombre] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [direccion, setDireccion] = useState('');

  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const [waitingResponse, setWaitingResponse] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);

  const observacionesTextInput = useRef();

  function handleBackActionClick() {
    navigation.goBack();
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
    navigation.navigate('Home', { pacienteId });
  }

  return (
    <View style={{...styles.container, backgroundColor: colors.surface}}>
      <Appbar.Header>
        <Appbar.BackAction onPress={handleBackActionClick} />
        <Appbar.Content title="Nueva Estudio Médico" />
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
            placeholder="Rayos X"
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
            placeholder="Ir en ayunas..."
            blurOnSubmit={true}
            returnKeyType="done"
            ref={observacionesTextInput}
            onChangeText={setObservaciones}
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

export default withTheme(NuevoEstudioScreen);
