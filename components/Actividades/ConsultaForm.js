import React, { useEffect, useRef, useState } from 'react'
import { StyleSheet, View } from 'react-native';
import { Button, TextInput, withTheme } from 'react-native-paper';
import FechaPicker from '../FechaPicker';

const axios = require('axios').default;

function ConsultaForm({ actividadId, waitingResponse, onCancel, onSubmit }) {

  const [nombre, setNombre] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [direccion, setDireccion] = useState('');
  const [fecha, setFecha] = useState(new Date());
  
  const observacionesTextInput = useRef();

  useEffect(() => {
    const fetchData = async () => {
      if(actividadId) {
        const response = await axios.get(`/api/actividads/${actividadId}`);
        const { nombre, observaciones, direccion, fecha } = response.data.actividad;
        setNombre(nombre);
        setObservaciones(observaciones);
        setDireccion(direccion);
        setFecha(new Date(fecha));
      }
    }

    fetchData()
      .catch(console.error)
  }, []);

  function handleSubmit() {
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

export default withTheme(ConsultaForm);
