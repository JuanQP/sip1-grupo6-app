import React, { useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, TextInput } from "react-native-paper";
import FechaPicker from '../FechaPicker';
import DropDown from "react-native-paper-dropdown";
import { Formik } from 'formik';
import * as yup from 'yup';
import { useQuery } from "react-query";
import { getProvincias, getSexos, getTiposDocumento, selectDropdownItems } from "../../src/api/dropdown";

const reviewSchema = yup.object({
  nombre: yup.string().required(),
  fechaNacimiento: yup.date().required(),
  sexoId: yup.number().required(),
  tipoDocumentoId: yup.number().required(),
  telefono: yup.string().required(),
  domicilio: yup.string().required(),
  provinciaId: yup.number().required(),
  localidad: yup.string().required(),
  obraSocial: yup.string().required(),
  numeroAfiliado: yup.string().required(),
  observaciones: yup.string().required(),
});

function PacienteForm({ initialValues, loading, onSubmit }) {
  const { data: listaSexos } = useQuery('sexos', getSexos, {
    select: selectDropdownItems,
    placeholderData: [],
  });
  const { data: listaTiposDocumento } = useQuery('tiposDocumento', getTiposDocumento, {
    select: selectDropdownItems,
    placeholderData: [],
  });
  const { data: listaProvincias } = useQuery('provincias', getProvincias, {
    select: selectDropdownItems,
    placeholderData: [],
  });
  const [showSexoDropDown, setShowSexoDropDown] = useState(false);
  const [showDocumentosDropDown, setShowDocumentosDropDown] = useState(false);
  const [showProvinciasDropDown, setShowProvinciasDropDown] = useState(false);
  const telefonoTextInput = useRef();
  const domicilioTextInput = useRef();
  const obraSocialTextInput = useRef();
  const numeroAfiliadoTextInput = useRef();
  const observacionesTextInput = useRef();

  function handleFormikSubmit(values, actions) {
    onSubmit({ ...values }, actions);
  }

  function handleFechaChange(fecha, setFieldValue) {
    setFieldValue('fecha', fecha);
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
          blurOnSubmit={true}
          returnKeyType="done"
          value={values.nombre}
          onChangeText={handleChange('nombre')}
          onBlur={handleBlur('nombre')}
          error={touched.nombre && errors.nombre}
        />
        {/* Fecha - Sexo */}
        <View style={{flexDirection: 'row'}}>
          <FechaPicker
            label="Fecha de Inicio"
            mode="datetime"
            placeholder="14/10/1991"
            formatString="DD/MM/YYYY"
            datetime={values.fecha || new Date()}
            onChange={(fecha) => handleFechaChange(fecha, setFieldValue)}
          />
          <View style={{flex: 1, marginLeft: 10}}>
            <DropDown
              label={"Sexo"}
              mode={"flat"}
              visible={showSexoDropDown}
              showDropDown={() => setShowSexoDropDown(true)}
              onDismiss={() => setShowSexoDropDown(false)}
              list={listaSexos}
              dropDownStyle={{width: '100%', flex: 1}}
              inputProps={{ style: { flex: 1, backgroundColor: 'transparent' } }}
              value={values.sexoId || ''}
              setValue={handleChange('sexoId')}
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
              list={listaTiposDocumento}
              dropDownStyle={{ flex: 1}}
              inputProps={{ style: { backgroundColor: 'transparent' } }}
              value={values.tipoDocumentoId || ''}
              setValue={handleChange('tipoDocumentoId')}
            />
          </View>
          <TextInput
            style={{backgroundColor: 'transparent', flex: 1, marginLeft: 10}}
            mode='flat'
            label='Número de Documento'
            placeholder='30111222'
            blurOnSubmit={false}
            returnKeyType="next"
            keyboardType={'number-pad'}
            onSubmitEditing={() => {
              telefonoTextInput.current.focus();
            }}
            value={values.numeroDocumento}
            onChangeText={handleChange('numeroDocumento')}
            onBlur={handleBlur('numeroDocumento')}
            error={touched.numeroDocumento && errors.numeroDocumento}
          />
        </View>
        <TextInput
          style={{backgroundColor: 'transparent'}}
          mode='flat'
          label='Teléfono'
          placeholder='+54 11 4321 5678'
          blurOnSubmit={true}
          returnKeyType="next"
          keyboardType={"phone-pad"}
          textContentType="telephoneNumber"
          ref={telefonoTextInput}
          onSubmitEditing={() => {
            domicilioTextInput.current.focus();
          }}
          value={values.telefono}
          onChangeText={handleChange('telefono')}
          onBlur={handleBlur('telefono')}
          error={touched.telefono && errors.telefono}
        />
        <TextInput
          style={{backgroundColor: 'transparent'}}
          mode='flat'
          label='Domicilio'
          placeholder='Lima 775'
          blurOnSubmit={true}
          returnKeyType="done"
          ref={domicilioTextInput}
          value={values.domicilio}
          onChangeText={handleChange('domicilio')}
          onBlur={handleBlur('domicilio')}
          error={touched.domicilio && errors.domicilio}
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
              list={listaProvincias}
              dropDownStyle={{ flex: 1}}
              inputProps={{ style: { backgroundColor: 'transparent' } }}
              value={values.provinciaId || ''}
              setValue={handleChange('provinciaId')}
            />
          </View>
          <TextInput
            style={{backgroundColor: 'transparent', flex: 1, marginLeft: 10}}
            mode='flat'
            label='Localidad'
            placeholder='Tigre'
            blurOnSubmit={true}
            returnKeyType="next"
            onSubmitEditing={() => {
              obraSocialTextInput.current.focus();
            }}
            value={values.localidad}
            onChangeText={handleChange('localidad')}
            onBlur={handleBlur('localidad')}
            error={touched.localidad && errors.localidad}
          />
        </View>
        {/* Obra Social - Afiliado */}
        <View style={{flexDirection: 'row'}}>
          <TextInput
            style={{backgroundColor: 'transparent', flex: 1}}
            mode='flat'
            label='Obra Social'
            placeholder='OSDE'
            blurOnSubmit={true}
            returnKeyType="next"
            ref={obraSocialTextInput}
            onSubmitEditing={() => {
              numeroAfiliadoTextInput.current.focus();
            }}
            value={values.obraSocial}
            onChangeText={handleChange('obraSocial')}
            onBlur={handleBlur('obraSocial')}
            error={touched.obraSocial && errors.obraSocial}
          />
          <TextInput
            style={{backgroundColor: 'transparent', flex: 1, marginLeft: 10}}
            mode='flat'
            label='Afiliado'
            placeholder='123456789'
            blurOnSubmit={true}
            returnKeyType="next"
            ref={numeroAfiliadoTextInput}
            onSubmitEditing={() => {
              observacionesTextInput.current.focus();
            }}
            value={values.numeroAfiliado}
            onChangeText={handleChange('numeroAfiliado')}
            onBlur={handleBlur('numeroAfiliado')}
            error={touched.numeroAfiliado && errors.numeroAfiliado}
          />
        </View>
        <TextInput
          style={{backgroundColor: 'transparent'}}
          mode='flat'
          label='Observaciones'
          placeholder='Paciente con diabetes, debe tomar medicación...'
          blurOnSubmit={true}
          returnKeyType="send"
          ref={observacionesTextInput}
          multiline
          value={values.observaciones}
          onChangeText={handleChange('observaciones')}
          onBlur={handleBlur('observaciones')}
          error={touched.observaciones && errors.observaciones}
        />
        <View style={styles.bottomView}>
          <Button
            mode='contained'
            onPress={handleSubmit}
            loading={loading}
            disabled={!isValid || loading }
            icon="content-save"
          >
            Guardar cambios
          </Button>
        </View>
        </>
        )}
      </Formik>
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