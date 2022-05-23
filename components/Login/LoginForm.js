import React, { useRef } from "react";
import { StyleSheet, View } from "react-native";
import { Button, HelperText, TextInput, withTheme } from "react-native-paper";
import { Formik } from 'formik';
import * as yup from 'yup';

const reviewSchema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().required(),
});

function LoginForm({ initialValues, loading, onSubmit }) {

  const passwordRef = useRef();

  function handleFormikSubmit(values, actions) {
    onSubmit(values, actions);
  }

  return (
    <View style={styles.form}>
      <Formik
        initialValues={initialValues}
        validationSchema={reviewSchema}
        enableReinitialize
        onSubmit={handleFormikSubmit}
      >
        {({ handleChange, handleBlur, handleSubmit, isValid, errors, touched, values }) => (
        <>
        <TextInput
          style={{...styles.textInput, backgroundColor: 'transparent'}}
          mode='flat'
          label="E-mail"
          placeholder="john.doe@email.com"
          textContentType="emailAddress"
          keyboardType='email-address'
          returnKeyType='next'
          blurOnSubmit={false}
          onSubmitEditing={() => { passwordRef.current.focus() }}
          value={values.email}
          onChangeText={handleChange('email')}
          onBlur={handleBlur('email')}
          error={touched.email && errors.email}
        />
        <HelperText type="error" visible={touched.email && errors.email}>
          {errors.email}
        </HelperText>
        <TextInput
          style={{...styles.textInput, backgroundColor: 'transparent'}}
          mode='flat'
          label="Contraseña"
          onChangeText={handleChange('password')}
          textContentType="password"
          secureTextEntry
          ref={passwordRef}
          value={values.password}
          onSubmitEditing={handleSubmit}
          onBlur={handleBlur('password')}
          error={touched.password && errors.password}
        />
        <HelperText type="error" visible={touched.password && errors.password}>
          {errors.password}
        </HelperText>
        <Button
          style={styles.button}
          mode='contained'
          onPress={handleSubmit}
          loading={loading}
          disabled={!isValid}
        >
          Acceder
        </Button>
        </>
        )}
      </Formik>
    </View>
  )
}

const styles = StyleSheet.create({
  form: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  textInput: {
    width: '100%',
  },
  button: {
    marginTop: 10,
    width: '100%',
  },  
});

export default withTheme(LoginForm);
