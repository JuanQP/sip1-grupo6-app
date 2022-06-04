import React, { useRef } from 'react'
import { StyleSheet, View } from 'react-native';
import { Button, TextInput, withTheme } from 'react-native-paper';
import FechaPicker from '../FechaPicker';
import { Formik } from 'formik';
import * as yup from 'yup';

const reviewSchema = yup.object({
  nombre: yup.string().required(),
  observaciones: yup.string().required(),
  direccion: yup.string().required(),
  fecha: yup.date().required(),
});

function ConsultaForm({ initialValues, loading, onCancel, onSubmit }) {

  const observacionesTextInput = useRef();

  function handleFormikSubmit(values, actions) {
    const { dias, ...actividad } = values;
    onSubmit({
      ...actividad,
      diaIds: [],
      tipo: 'Consulta Médica',
    }, actions);
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
        placeholder="Otorrinolaringología"
        blurOnSubmit={true}
        returnKeyType="next"
        value={values.nombre}
        onChangeText={handleChange('nombre')}
        onBlur={handleBlur('nombre')}
        error={touched.nombre && errors.nombre}
      />
      <FechaPicker
        label="Fecha"
        mode="datetime"
        placeholder="14/10/1991 22:00"
        formatString="DD/MM/YYYY HH:mm"
        datetime={values.fecha || new Date()}
        onChange={(fecha) => setFieldValue('fecha', fecha)}
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
        multiline
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

export default withTheme(ConsultaForm);
