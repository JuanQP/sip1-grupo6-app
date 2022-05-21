import { useEffect, useRef, useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { Button, TextInput } from "react-native-paper";
import FechaPicker from '../FechaPicker';
import { mapToLabelValue } from '../../utils/utils';
import DropDown from "react-native-paper-dropdown";

const axios = require('axios').default;

function PacienteForm({ pacienteId, onSavedPaciente }) {

  const [nombre, setNombre] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState(new Date());
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

  const [listaSexos, setListaSexos] = useState([]);
  const [listaTiposDocumento, setListaTiposDocumento] = useState([]);
  const [listaProvincias, setListaProvincias] = useState([]);

  const [waitingResponse, setWaitingResponse] = useState(false);
  const [showSexoDropDown, setShowSexoDropDown] = useState(false);
  const [showDocumentosDropDown, setShowDocumentosDropDown] = useState(false);
  const [showProvinciasDropDown, setShowProvinciasDropDown] = useState(false);

  const telefonoTextInput = useRef();
  const domicilioTextInput = useRef();
  const obraSocialTextInput = useRef();
  const numeroAfiliadoTextInput = useRef();
  const observacionesTextInput = useRef();

  function setPacienteData(paciente) {
    setNombre(paciente.nombre);
    setFechaNacimiento(new Date(paciente.fechaNacimiento));
    setSexo(paciente.sexo.id);
    setTipoDocumento(paciente.tipoDocumento.id);
    setNumeroDocumento(paciente.numeroDocumento);
    setTelefono(paciente.telefono);
    setDomicilio(paciente.domicilio);
    setProvincia(paciente.provincia.id);
    setLocalidad(paciente.localidad);
    setObraSocial(paciente.obraSocial);
    setNumeroAfiliado(paciente.numeroAfiliado);
    setObservaciones(paciente.observaciones);
  }

  useEffect(() => {
    const fetchData = async () => {
      const [tiposResp, provResp, sexosResp, pacienteResp] = await Promise.all([
        axios.get(`/api/tipos-documento`),
        axios.get(`/api/provincias`),
        axios.get(`/api/sexos`),
        pacienteId ? axios.get(`/api/pacientes/${pacienteId}`) : Promise.resolve(null),
      ]);

      setListaTiposDocumento(tiposResp.data.tipoDocumentos.map(td => mapToLabelValue(td)));
      setListaProvincias(provResp.data.provincia.map(p => mapToLabelValue(p)));
      setListaSexos(sexosResp.data.sexos.map(s => mapToLabelValue(s)));

      if(!pacienteId) return;

      setPacienteData(pacienteResp.data.paciente);
    }

    fetchData()
      .catch(console.error)
  }, []);

  async function handleSubmit() {
    const paciente = {
      nombre,
      fechaNacimiento,
      sexoId: sexo,
      tipoDocumentoId: tipoDocumento,
      numeroDocumento,
      telefono,
      domicilio,
      provinciaId: provincia,
      localidad,
      obraSocial,
      numeroAfiliado,
      observaciones,
    };
    try {
      setWaitingResponse(true);
      const axiosQuery = pacienteId ? axios.patch : axios.post;
      const response = await axiosQuery(`/api/pacientes/${pacienteId ?? ''}`, paciente);
      setPacienteData(response.data.paciente);
      onSavedPaciente(response.data.paciente);
    } catch (error) {
      console.error(error);
      Alert.alert("😞", "Algo salió mal...");
    }
    finally {
      setWaitingResponse(false);
    }
  }

  return (
    <View>
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
        <FechaPicker
          label="Fecha de Nacimiento"
          fecha={fechaNacimiento}
          onChange={setFechaNacimiento}
        />
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
            list={listaTiposDocumento}
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
        multiline
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
    </View>
  )
}

PacienteForm.defaultProps = {
  onSavedPaciente: () => {},
}

const styles = StyleSheet.create({
  bottomView: {
    flex: 1,
    marginTop: 20,
    justifyContent: "center",
  },
});

export default PacienteForm;