import React, { useState } from 'react'
import { StatusBar } from 'expo-status-bar';
import { Alert, Button, StyleSheet, Text, View } from 'react-native';

// La IP del Backend con su puerto
const backend_ip = "192.168.0.6:8080";

/**
 * Crea un mensaje para ser mostrado en un popup con información del servidor.
 * @param {*} data La info recibida desde el servidor
 * @returns Un amigable mensaje
 */
function personaDetails(data) {
  const count = data.length;
  if(count == 0) {
    return "No hay registros creados todavía!";
  }
  const persona = data[0];
  return `Hay ${count} registros.\n`
    + `Y el primero de ellos es:\n${persona.apellido.toUpperCase()}, ${persona.nombre} (${persona.edad})`;
}
export default function App() {

  const [isLoading, setLoading] = useState(false);

  function fetchDB() {
    setLoading(true);
    fetch(`http://${backend_ip}/api/personas`)
      .then(response => response.json())
      .then(data => {
        const message = personaDetails(data);
        Alert.alert("Conexión OK!", message);
      })
      .catch(() => {
        Alert.alert("Algo salió mal...", "No se pudo conectar a la base de datos");
      })
      .finally(() => setLoading(false));
  }

  return (
    <View style={styles.container}>
      <Text>UADE - Seminario de Integración Profesional I</Text>
      <Text>React Native + Expo</Text>
      <Button
        title="Testear DB"
        onPress={fetchDB}
        disabled={isLoading}
      />
      <Text></Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
