import React, { useEffect, useRef, useState } from 'react'
import { StyleSheet, View } from 'react-native';
import { Button, Switch, Text, TextInput, withTheme } from 'react-native-paper';
import FechaPicker from '../FechaPicker';
import DropDown from "react-native-paper-dropdown";
import { Formik } from 'formik';
import * as yup from 'yup';

const axios = require('axios').default;
const reviewSchema = yup.object({
  nombre: yup.string().required(),
  observaciones: yup.string().required(),
  direccion: yup.string().required(),
  repeticiones: yup.boolean().required(),
  duracion: yup.number(),
  frecuencia: yup.number(),
  diaIds: yup.array().of(yup.number()).min(0).required(),
  fecha: yup.date(),
});

function OtroForm({ initialValues, loading, onCancel, onSubmit, ...props }) {

  const { colors } = props.theme;
  // const [nombre, setNombre] = useState('');
  // const [observaciones, setObservaciones] = useState('');
  // const [direccion, setDireccion] = useState('');
  // const [repeticiones, setRepeticiones] = useState(false);
  // const [duracion, setDuracion] = useState('');
  // const [frecuencia, setFrecuencia] = useState('');
  // const [dias, setDias] = useState('');
  // const [fecha, setFecha] = useState(new Date());
  const [listaDias, setListaDias] = useState([]);
  const [showMultiSelectDropDown, setShowMultiSelectDropDown] = useState(false);
  const observacionesTextInput = useRef();
  const frecuenciaTextInput = useRef();

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(`/api/dias`);
      setListaDias(response.data.dia.map(d => ({label: d.descripcion, value: d.id})));
    }
    fetchData().catch(console.error);
  }, []);

  function handleFormikSubmit(values, actions) {
    onSubmit({
      ...values,
      tipo: 'Otro',
    }, actions);
  }
  
  function handleDiasChange(diasString, setFieldValue) {
    const ids = diasString.split(",").filter(id => id !== "");
    setFieldValue('diaIds', ids);
  }

  function handleSwitchChange(value, setFieldValue) {
    setFieldValue(!value);
  }

  function handleFechaChange(fecha, setFieldValue) {
    setFieldValue('fecha', fecha);
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={reviewSchema}
      enableReinitialize
      onSubmit={handleFormikSubmit}
    >
      {({ handleChange, handleBlur, handleSubmit, setFieldValue, isValid, errors, touched, values }) => (
      <>
      <TextInput
        style={{backgroundColor: 'transparent'}}
        mode='flat'
        label='Nombre de la Actividad'
        blurOnSubmit={true}
        returnKeyType="next"
        value={values.nombre}
        onChangeText={handleChange('nombre')}
        onBlur={handleBlur('nombre')}
        error={touched.nombre && errors.nombre}
      />
      <FechaPicker
        label="Fecha de Inicio"
        mode="datetime"
        placeholder="14/10/1991"
        formatString="DD/MM/YYYY HH:mm"
        datetime={values.fecha || new Date()}
        onChange={(fecha) => handleFechaChange(fecha, setFieldValue)}
      />
      <TextInput
        style={{backgroundColor: 'transparent'}}
        mode='flat'
        label='Dirección'
        placeholder="Lima 775"
        blurOnSubmit={false}
        returnKeyType="next"
        onSubmitEditing={() => {
          observacionesTextInput.current.focus();
        }}
        value={values.direccion}
        onChangeText={handleChange('direccion')}
        onBlur={handleBlur('direccion')}
        error={touched.direccion && errors.direccion}
      />
      <TextInput
        style={{backgroundColor: 'transparent'}}
        mode='flat'
        label='Observaciones'
        placeholder="Llevar carnet de Obra Social"
        blurOnSubmit={true}
        returnKeyType="send"
        ref={observacionesTextInput}
        value={values.observaciones}
        onChangeText={handleChange('observaciones')}
        onBlur={handleBlur('observaciones')}
        error={touched.observaciones && errors.observaciones}
      />
      <View style={styles.switch}>
        <Text>REPETICIONES</Text>
        <Switch
          color={colors.primary}
          value={values.repeticiones}
          onValueChange={() => handleSwitchChange(values.repeticiones, setFieldValue)}
        />
      </View>
      {/* Si hay repeticiones mostrar lo siguiente: */}
      {!values.repeticiones ? null : (
      <>
        <TextInput
          style={{ backgroundColor: 'transparent' }}
          mode='flat'
          label='Duración (en días)'
          placeholder="30"
          blurOnSubmit={false}
          returnKeyType="next"
          onSubmitEditing={() => {
            frecuenciaTextInput.current.focus();
          }}
          keyboardType="number-pad"
          value={values.duracion}
          onChangeText={handleChange('duracion')}
          onBlur={handleBlur('duracion')}
          error={touched.duracion && errors.duracion}
        />
        <TextInput
          style={{ backgroundColor: 'transparent' }}
          mode='flat'
          label='Frecuencia (en horas)'
          placeholder="24"
          blurOnSubmit={true}
          returnKeyType="next"
          ref={frecuenciaTextInput}
          onSubmitEditing={() => {
            setShowMultiSelectDropDown(true);
          }}
          keyboardType="number-pad"
          value={values.frecuencia}
          onChangeText={handleChange('frecuencia')}
          onBlur={handleBlur('frecuencia')}
          error={touched.frecuencia && errors.frecuencia}
        />
        <DropDown
          label={"Días"}
          mode={"flat"}
          visible={showMultiSelectDropDown}
          showDropDown={() => setShowMultiSelectDropDown(true)}
          onDismiss={() => setShowMultiSelectDropDown(false)}
          list={listaDias}
          multiSelect
          inputProps={{ style: { backgroundColor: 'transparent' } }}
          value={values.diaIds?.join(",") || ''} // "1,2,3..."
          setValue={(diasString) => handleDiasChange(diasString, setFieldValue)}
        />
      </>
      )}
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
          loading={loading}
          disabled={!isValid || loading}
          icon="content-save"
        >
          Guardar
        </Button>
      </View>
      </>
      )}
    </Formik>
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
