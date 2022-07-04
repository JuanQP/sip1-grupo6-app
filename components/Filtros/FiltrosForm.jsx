import React, { useState } from 'react'
import { StyleSheet, View } from 'react-native';
import { Button, withTheme } from 'react-native-paper';
import DropDown from "react-native-paper-dropdown";
import { Formik } from 'formik';
import * as yup from 'yup';
import { mapToLabelValue, useToggle } from '../../utils/utils';
import { useQuery } from 'react-query';
import { getTiposActividades, getEstados } from '../../src/api/dropdown';

const reviewSchema = yup.object({
  tiposIds: yup.array().of(yup.number()),
  estadosIds: yup.array().of(yup.number()),
});

function FiltrosForm({ initialValues, loading, onCancel, onSubmit }) {
  useQuery('tipos', getTiposActividades, {
    onSuccess: (tipos) => {
        setListaTipos(tipos.map(d => mapToLabelValue(d, 'descripcion', 'id')));
    }
  });
  useQuery('estados', getEstados, {
    onSuccess: (estados) => {
        setListaEstados(estados.map(d => mapToLabelValue(d, 'descripcion', 'id')));
    }
  });
  const [listaTipos, setListaTipos] = useState([]);
  const [listaEstados, setListaEstados] = useState([]);
  const [showListaTipos, toggleShowListaTipos] = useToggle(false);
  const [showListaEstados, toggleShowListaEstados] = useToggle(false);

  function handleFormikSubmit(values, actions) {
    const { tipos, ...actividad } = values;
    onSubmit({
      ...values,
    }, actions);
  }

  function handleTiposChange(tiposString, setFieldValue) {
    const ids = tiposString.split(",").filter(id => id !== "");
    setFieldValue('tiposIds', ids);
  }

  function handleEstadosChange(estadosString, setFieldValue) {
    const ids = estadosString.split(",").filter(id => id !== "");
    setFieldValue('estadosIds', ids);
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={reviewSchema}
      enableReinitialize
      onSubmit={handleFormikSubmit}
    >
      {({ handleSubmit, setFieldValue, isValid, values, resetForm }) => (
      <>
      <DropDown
        label={"Tipo de Actividad"}
        mode={"flat"}
        visible={showListaTipos}
        showDropDown={() => toggleShowListaTipos(true)}
        onDismiss={() => toggleShowListaTipos(false)}
        list={listaTipos}
        multiSelect
        inputProps={{style: {backgroundColor: 'transparent'}}}
        value={values.tiposIds?.join(",") || ''} // "1,2,3..."
        setValue={(tiposString) => handleTiposChange(tiposString, setFieldValue)}
      />
        <DropDown
        label={"Estado"}
        mode={"flat"}
        visible={showListaEstados}
        showDropDown={() => toggleShowListaEstados(true)}
        onDismiss={() => toggleShowListaEstados(false)}
        list={listaEstados}
        multiSelect
        inputProps={{style: {backgroundColor: 'transparent'}}}
        value={values.estadosIds?.join(",") || ''} // "1,2,3..."
        setValue={(estadosString) => handleEstadosChange(estadosString, setFieldValue)}
      />
      <View style={styles.bottomView}>
        <Button
          mode='outlined'
          type='reset'
          onPress={() => {
            resetForm();
            onCancel();
          }}
        >
          Limpiar
        </Button>
        <Button
          mode='contained'
          onPress={handleSubmit}
          loading={loading}
          disabled={!isValid || loading}
        >
          Aplicar
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

export default withTheme(FiltrosForm);
