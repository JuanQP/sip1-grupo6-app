import React, { useRef, useState } from 'react'
import { StyleSheet, View } from 'react-native';
import { Button, TextInput, withTheme } from 'react-native-paper';
import DropDown from "react-native-paper-dropdown";
import FechaPicker from "../FechaPicker";
import { Formik } from 'formik';
import * as yup from 'yup';
import { mapToLabelValue, useToggle } from '../../utils/utils';
import { useQuery } from 'react-query';
import { getDias } from '../../src/api/dropdown';

const reviewSchema = yup.object({
  nombre: yup.string().required(),
  observaciones: yup.string().required(),
  dosis: yup.string().required(),
  duracion: yup.number().required(),
  frecuencia: yup.number().required(),
  diaIds: yup.array().of(yup.number()).min(1).required(),
  fecha: yup.date().required(),
});

function MedicacionForm({ initialValues, loading, onDelete, onSubmit }) {
  useQuery('dias', getDias, {
    onSuccess: (dias) => {
      setListaDias(dias.map(d => mapToLabelValue(d, 'descripcion', 'id')));
    }
  });
  const [listaDias, setListaDias] = useState([]);
  const [showDropDown, toggleShowDropDown] = useToggle(false);
  const observacionesTextInput = useRef();
  const dosisTextInput = useRef();
  const duracionTextInput = useRef();
  const frecuenciaTextInput = useRef();

  function handleFormikSubmit(values, actions) {
    const { dias, ...actividad } = values;
    onSubmit({
      ...values,
      fecha: new Date(actividad.fecha),
      frecuencia: String(actividad.frecuencia),
      duracion: String(actividad.duracion),
      tipo: 'Medicación',
    }, actions);
  }

  function handleDiasChange(diasString, setFieldValue) {
    const ids = diasString.split(",").filter(id => id !== "");
    setFieldValue('diaIds', ids);
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
        placeholder="Omeprazol"
        blurOnSubmit={false}
        onSubmitEditing={() => {
          observacionesTextInput.current.focus();
        }}
        returnKeyType="next"
        value={values.nombre}
        onChangeText={handleChange('nombre')}
        onBlur={handleBlur('nombre')}
        error={touched.nombre && errors.nombre}
      />
      <TextInput
        style={{backgroundColor: 'transparent'}}
        mode='flat'
        label='Observaciones'
        placeholder="Debe ingerir alimentos antes..."
        blurOnSubmit={true}
        onSubmitEditing={() => {
          dosisTextInput.current.focus();
        }}
        returnKeyType="next"
        ref={observacionesTextInput}
        value={values.observaciones}
        onChangeText={handleChange('observaciones')}
        onBlur={handleBlur('observaciones')}
        error={touched.observaciones && errors.observaciones}
      />
      <TextInput
        style={{backgroundColor: 'transparent'}}
        mode='flat'
        label='Dósis'
        placeholder="25 mg"
        blurOnSubmit={true}
        returnKeyType="next"
        ref={dosisTextInput}
        value={values.dosis}
        onChangeText={handleChange('dosis')}
        onBlur={handleBlur('dosis')}
        error={touched.dosis && errors.dosis}
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
        label='Duración (en días)'
        placeholder="30"
        blurOnSubmit={false}
        returnKeyType="next"
        ref={duracionTextInput}
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
        style={{backgroundColor: 'transparent'}}
        mode='flat'
        label='Frecuencia (en horas)'
        placeholder="24"
        blurOnSubmit={true}
        returnKeyType="next"
        ref={frecuenciaTextInput}
        onSubmitEditing={() => {
          toggleShowDropDown(true);
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
        visible={showDropDown}
        showDropDown={() => toggleShowDropDown(true)}
        onDismiss={() => toggleShowDropDown(false)}
        list={listaDias}
        multiSelect
        inputProps={{style: {backgroundColor: 'transparent'}}}
        value={values.diaIds?.join(",") || ''} // "1,2,3..."
        setValue={(diasString) => handleDiasChange(diasString, setFieldValue)}
      />
      <View style={styles.bottomView}>
        {initialValues.actividadId && (
          <Button
            color="red"
            mode='outlined'
            onPress={() => onDelete(initialValues.actividadId)}
            icon="delete"
          >
            Borrar
          </Button>
        )}
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
});

export default withTheme(MedicacionForm);
