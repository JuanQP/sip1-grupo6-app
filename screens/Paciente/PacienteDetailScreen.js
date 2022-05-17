import React, { useRef, useState } from 'react'
import { StatusBar } from 'expo-status-bar';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import {
  Appbar,
  Avatar,
  Button,
  IconButton,
  List,
  TextInput,
  Title,
  withTheme
} from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import DropDown from "react-native-paper-dropdown";
import {
  listaProvincias,
  listaSexos,
  listaTiposDocumentos
} from '../../utils/utils';
import FamiliarItem from './FamiliarItem';

const familiares = [
  {
    nombre: 'Jorge Díaz Pérez',
    relacion: 'Hijo',
    telefono: '+54 11 5678 1234',
    provincia: 'CABA',
    localidad: 'Barracas',
    esContactoDeEmergencia: true,
  },
  {
    nombre: 'Florencia Díaz Pérez',
    relacion: 'Hija',
    telefono: '+54 11 9876 2345',
    provincia: 'CABA',
    localidad: 'Villa Lugano',
    esContactoDeEmergencia: false,
  },
]

function PacienteDetailScreen({ navigation, ...props }) {

  const { colors } = props.theme;

  const [nombre, setNombre] = useState('');
  const [date, setDate] = useState(new Date());
  const [sexo, setSexo] = useState('');
  const [tipoDocumento, setTipoDocumento] = useState('');
  const [numeroDocumento, setNumeroDocumento] = useState('');
  const [telefono, setTelefono] = useState('');
  const [domicilio, setDomicilio] = useState('');
  const [provincia, setProvincia] = useState('');
  const [localidad, setLocalidad] = useState('');
  const [obraSocial, setObraSocial] = useState('');
  const [numeroAfiliado, setNumeroAfiliado] = useState('');
  const [observaciones, setObservaciones] = useState('');

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showSexoDropDown, setShowSexoDropDown] = useState(false);
  const [showDocumentosDropDown, setShowDocumentosDropDown] = useState(false);
  const [showProvinciasDropDown, setShowProvinciasDropDown] = useState(false);

  const [waitingResponse, setWaitingResponse] = useState(false);

  const telefonoTextInput = useRef();
  const domicilioTextInput = useRef();
  const obraSocialTextInput = useRef();
  const numeroAfiliadoTextInput = useRef();
  const observacionesTextInput = useRef();

  function handleBackActionClick() {
    navigation.goBack();
  }

  async function handleSubmit() {
    setWaitingResponse(true);
    // Simulamos una espera de 2 segundos...
    await new Promise(r => setTimeout(r, 2000));
    setWaitingResponse(false);
    Alert.alert("✔️", "Cambios guardados");
  }

  function handleNewFamiliar() {
    Alert.alert("🤔", "Falta implementar");
  }

  function onDateChange (event, selectedDate) {
    setShowDatePicker(false);
    if(event.type === "dismissed")
      return;
    setDate(selectedDate);
  };

  function beginDatePicker() {
    hideAllCalendars();
    setShowDatePicker(true);
  }

  function hideAllCalendars() {
    setShowDatePicker(false);
  }

  return (
    <View style={{...styles.container, backgroundColor: colors.surface}}>
      <Appbar.Header>
        <Appbar.BackAction onPress={handleBackActionClick} />
        <Appbar.Content title="Mi Paciente" />
      </Appbar.Header>
      {/* Formulario */}
      <View style={styles.formContainer}>
        <ScrollView>
          <Avatar.Image
            style={{alignSelf: "center"}}
            size={64}
            source={require('../../assets/mirta.png')}
          />
          <TextInput
            style={{backgroundColor: 'transparent'}}
            mode='flat'
            label='Nombre'
            value={nombre}
            blurOnSubmit={true}
            returnKeyType="done"
            onChangeText={setNombre}
          />
          {/* Fecha - Sexo */}
          <View style={{flexDirection: 'row'}}>
            {/* Date Picker */}
            <View style={{flexDirection: "row", alignItems: "center", flex: 1}}>
              <IconButton
                color={colors.primary}
                icon="calendar"
                onPress={beginDatePicker}
              />
              <TextInput
                style={{backgroundColor: 'transparent'}}
                mode='flat'
                label='Fecha de Nacimiento'
                value={moment(date).format("DD/MM/YYYY")}
                placeholder="14/10/2022 16:00"
                disabled
              />
              {(showDatePicker && <DateTimePicker
                testID="datePicker"
                value={date}
                mode={"date"}
                onChange={onDateChange}
              />)}
            </View>
            <View style={{flex: 1, marginLeft: 10}}>
              <DropDown
                label={"Sexo"}
                mode={"flat"}
                visible={showSexoDropDown}
                showDropDown={() => setShowSexoDropDown(true)}
                onDismiss={() => setShowSexoDropDown(false)}
                value={sexo}
                setValue={setSexo}
                list={listaSexos}
                dropDownStyle={{width: '100%', flex: 1}}
                inputProps={{ style: { flex: 1, backgroundColor: 'transparent' } }}
              />
            </View>
          </View>
          {/* Tipo de Documento - Número de Documento */}
          <View style={{flexDirection: 'row'}}>
            <View style={{flex: 1}}>
              <DropDown
                label={"Documento"}
                mode={"flat"}
                visible={showDocumentosDropDown}
                showDropDown={() => setShowDocumentosDropDown(true)}
                onDismiss={() => setShowDocumentosDropDown(false)}
                value={tipoDocumento}
                setValue={setTipoDocumento}
                list={listaTiposDocumentos}
                dropDownStyle={{ flex: 1}}
                inputProps={{ style: { backgroundColor: 'transparent' } }}
              />
            </View>
            <TextInput
              style={{backgroundColor: 'transparent', flex: 1, marginLeft: 10}}
              mode='flat'
              label='Número de Documento'
              placeholder='30111222'
              value={numeroDocumento}
              blurOnSubmit={false}
              returnKeyType="next"
              onChangeText={setNumeroDocumento}
              keyboardType={'number-pad'}
              onSubmitEditing={() => {
                telefonoTextInput.current.focus();
              }}
            />
          </View>
          <TextInput
            style={{backgroundColor: 'transparent'}}
            mode='flat'
            label='Teléfono'
            placeholder='+54 11 4321 5678'
            value={telefono}
            blurOnSubmit={true}
            returnKeyType="next"
            onChangeText={setTelefono}
            keyboardType={"phone-pad"}
            textContentType="telephoneNumber"
            ref={telefonoTextInput}
            onSubmitEditing={() => {
              domicilioTextInput.current.focus();
            }}
          />
          <TextInput
            style={{backgroundColor: 'transparent'}}
            mode='flat'
            label='Domicilio'
            placeholder='Lima 775'
            value={domicilio}
            blurOnSubmit={true}
            returnKeyType="done"
            onChangeText={setDomicilio}
            ref={domicilioTextInput}
          />
          {/* Provincia - Localidad */}
          <View style={{flexDirection: 'row'}}>
            <View style={{flex: 1}}>
              <DropDown
                label={"Provincia"}
                mode={"flat"}
                visible={showProvinciasDropDown}
                showDropDown={() => setShowProvinciasDropDown(true)}
                onDismiss={() => setShowProvinciasDropDown(false)}
                value={provincia}
                setValue={setProvincia}
                list={listaProvincias}
                dropDownStyle={{ flex: 1}}
                inputProps={{ style: { backgroundColor: 'transparent' } }}
              />
            </View>
            <TextInput
              style={{backgroundColor: 'transparent', flex: 1, marginLeft: 10}}
              mode='flat'
              label='Localidad'
              placeholder='Tigre'
              value={localidad}
              blurOnSubmit={true}
              returnKeyType="next"
              onChangeText={setLocalidad}
              onSubmitEditing={() => {
                obraSocialTextInput.current.focus();
              }}
            />
          </View>
          {/* Obra Social - Afiliado */}
          <View style={{flexDirection: 'row'}}>
            <TextInput
              style={{backgroundColor: 'transparent', flex: 1}}
              mode='flat'
              label='Obra Social'
              placeholder='OSDE'
              value={obraSocial}
              blurOnSubmit={true}
              returnKeyType="next"
              onChangeText={setObraSocial}
              ref={obraSocialTextInput}
              onSubmitEditing={() => {
                numeroAfiliadoTextInput.current.focus();
              }}
            />
            <TextInput
              style={{backgroundColor: 'transparent', flex: 1, marginLeft: 10}}
              mode='flat'
              label='Afiliado'
              placeholder='123456789'
              value={numeroAfiliado}
              blurOnSubmit={true}
              returnKeyType="next"
              onChangeText={setNumeroAfiliado}
              ref={numeroAfiliadoTextInput}
              onSubmitEditing={() => {
                observacionesTextInput.current.focus();
              }}
            />
          </View>
          <TextInput
            style={{backgroundColor: 'transparent'}}
            mode='flat'
            label='Observaciones'
            placeholder='Paciente con diabetes, debe tomar medicación...'
            value={observaciones}
            blurOnSubmit={true}
            returnKeyType="send"
            onChangeText={setObservaciones}
            ref={observacionesTextInput}
          />
          <View style={styles.bottomView}>
            <Button
              mode='contained'
              onPress={handleSubmit}
              loading={waitingResponse}
              disabled={waitingResponse}
              icon="content-save"
            >
              Guardar cambios
            </Button>
          </View>

          <View style={{ backgroundColor: colors.surface, marginTop: 20 }}>
            <Title style={{alignSelf: "center"}}>Familiares</Title>
            <List.Section>
              {familiares.map(f => <FamiliarItem key={f.id} familiar={f} />)}
            </List.Section>
            <Button
              mode='contained'
              onPress={handleNewFamiliar}
              icon="account-plus"
            >
              Agregar familiar
            </Button>
          </View>
        </ScrollView>
      </View>
      <StatusBar style="auto" />
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
    flex: 1,
    marginTop: 20,
    justifyContent: "center",
  },
});

export default withTheme(PacienteDetailScreen);
