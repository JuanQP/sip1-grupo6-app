import { useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, TextInput, withTheme } from "react-native-paper";

function LoginForm({ loading, onSubmit }) {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const passwordRef = useRef();

  function handleLogin() {
    onSubmit({
      email,
      password,
    });
  }

  return (
    <View style={styles.form}>
      <TextInput
        style={{...styles.textInput, backgroundColor: 'transparent'}}
        mode='flat'
        label="E-mail"
        value={email}
        placeholder="john.doe@email.com"
        onChangeText={setEmail}
        textContentType="username"
        keyboardType='email-address'
        returnKeyType='next'
        blurOnSubmit={false}
        onSubmitEditing={() => {
          passwordRef.current.focus();
        }}
      />
      <TextInput
        style={{...styles.textInput, backgroundColor: 'transparent'}}
        mode='flat'
        label="Contraseña"
        value={password}
        onChangeText={setPassword}
        textContentType="password"
        secureTextEntry
        ref={passwordRef}
        onSubmitEditing={handleLogin}
      />
      <Button
        style={styles.button}
        mode='contained'
        onPress={handleLogin}
        loading={loading}
        disabled={loading || password === '' || email === ''}
      >
        Acceder
      </Button>
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
