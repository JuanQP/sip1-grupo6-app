import React, { useRef, useState } from 'react'
import { StyleSheet, View } from 'react-native';
import { Button, Checkbox, Text, TextInput, withTheme } from 'react-native-paper';
import DropDown from 'react-native-paper-dropdown';
import { Formik } from 'formik';
import * as yup from 'yup';
import { getProvincias, selectDropdownItems } from '../../src/api/dropdown';
import { useQuery } from 'react-query';

const reviewSchema = yup.object({
  nombre: yup.string().required(),
  relacion: yup.string().required(),
  provinciaId: yup.number().integer().required(),
  localidad: yup.string().required(),
  telefono: yup.string().required(),
  esContactoDeEmergencia: yup.bool().required(),
});

function FamiliarForm({ initialValues, loading, onCancel, onSubmit, ...props }) {
  const { colors } = props.theme;
  const [showProvinciasDropDown, setShowProvinciasDropDown] = useState(false);
  const { data: listaProvincias } = useQuery('provincias', getProvincias, {
    select: selectDropdownItems,
    placeholderData: [],
  });
  const relacionTextInput = useRef();
  const telefonoTextInput = useRef();

  function handleContactoEmergenciaChange(esContactoDeEmergencia, setFieldValue) {
    setFieldValue('esContactoDeEmergencia', !esContactoDeEmergencia)
  }

  function handleShowDropDown() {
    setShowProvinciasDropDown(true);
  }

  function handleDismissDropDown() {
    setShowProvinciasDropDown(false);
  }

  function handleFormikSubmit(values, actions) {
    onSubmit(values, actions);
  }

  return (
    <View>
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
          label='Nombre'
          placeholder="Juan Pérez"
          blurOnSubmit={false}
          returnKeyType="next"
          onSubmitEditing={() => relacionTextInput.current.focus()}
          value={values.nombre}
          onChangeText={handleChange('nombre')}
          onBlur={handleBlur('nombre')}
          error={touched.nombre && errors.nombre}
        />
        <TextInput
          style={{backgroundColor: 'transparent'}}
          mode='flat'
          label='Relación'
          placeholder="Hijo, Hija, Esposo..."
          blurOnSubmit={true}
          returnKeyType="next"
          ref={relacionTextInput}
          value={values.relacion}
          onChangeText={handleChange('relacion')}
          onBlur={handleBlur('relacion')}
          error={touched.relacion && errors.relacion}
        />
        <DropDown
          label={"Provincia"}
          mode={"flat"}
          visible={showProvinciasDropDown}
          showDropDown={handleShowDropDown}
          onDismiss={handleDismissDropDown}
          list={listaProvincias}
          dropDownStyle={{ flex: 1}}
          inputProps={{ style: { backgroundColor: 'transparent' } }}
          value={values.provinciaId || ''}
          setValue={handleChange('provinciaId')}
        />
        <TextInput
          style={{backgroundColor: 'transparent'}}
          mode='flat'
          label='Localidad'
          placeholder="Tigre, Pilar..."
          blurOnSubmit={false}
          returnKeyType="next"
          onSubmitEditing={() => telefonoTextInput.current.focus()}
          value={values.localidad}
          onChangeText={handleChange('localidad')}
          onBlur={handleBlur('localidad')}
          error={touched.localidad && errors.localidad}
        />
        <TextInput
          style={{backgroundColor: 'transparent'}}
          mode='flat'
          label='Teléfono'
          placeholder="1122334455"
          blurOnSubmit={true}
          returnKeyType="next"
          keyboardType="number-pad"
          ref={telefonoTextInput}
          value={values.telefono}
          onChangeText={handleChange('telefono')}
          onBlur={handleBlur('telefono')}
          error={touched.telefono && errors.telefono}
        />
        <View style={styles.checkbox}>
          <Text>CONTACTO DE EMERGENCIA?</Text>
          <Checkbox
            color={colors.primary}
            status={values.esContactoDeEmergencia ? 'checked' : 'unchecked'}
            onPress={() => handleContactoEmergenciaChange(values.esContactoDeEmergencia, setFieldValue)}
          />
        </View>
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
    </View>
  )
}

const styles = StyleSheet.create({
  bottomView: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  checkbox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 20,
  }
});

export default withTheme(FamiliarForm);
