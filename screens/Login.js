import { useRef, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Appbar, Button, Paragraph, TextInput } from "react-native-paper";

export default function LoginScreen({ navigation }) {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [waitingResponse, setWaitingResponse] = useState(false);

  const passwordRef = useRef();

  async function handleLogin() {
    setWaitingResponse(true);
    // Simulamos una espera de 2 segundos...
    await new Promise(r => setTimeout(r, 2000));
    setWaitingResponse(false);

    if(email !== 'test' || password !== 'test') {
      Alert.alert('Login incorrecto 🤔', 'E-mail o contraseña incorrectos');
      return;
    }

    navigation.navigate('Home');
  }

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="Login" />
      </Appbar.Header>
      <View style={styles.loginForm}>
        <Paragraph>
          ¡Bienvenido 😄!
        </Paragraph>
        <TextInput
          style={styles.textInput}
          mode='outlined'
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
          style={styles.textInput}
          mode='outlined'
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
          loading={waitingResponse}
          disabled={waitingResponse || password === '' || email === ''}
        >
          Acceder
        </Button>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loginForm: {
    padding: 32,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  textInput: {
    width: '100%',
  },
  button: {
    marginTop: 10,
    width: '100%',
  },
});
