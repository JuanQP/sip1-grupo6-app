import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/Home';
import MisPacientesScreen from '../screens/MisPacientes';
import LoginScreen from '../screens/Login';
import NuevaActividadScreen from '../screens/NuevaActividadScreen';
import NuevaActividadMedicacionScreen from '../screens/NuevaActividadMedicacionScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ title: 'Login' }}
      />
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'Actividades' }}
      />
      <Stack.Screen
        name="MisPacientes"
        component={MisPacientesScreen}
        options={{ title: 'Mis Pacientes' }}
      />
      <Stack.Screen
        name="NuevaActividad"
        component={NuevaActividadScreen}
        options={{ title: 'Nueva Actividad' }}
      />
      <Stack.Screen
        name="NuevaActividadMedicacion"
        component={NuevaActividadMedicacionScreen}
        options={{ title: 'Nueva Medicación' }}
      />
    </Stack.Navigator>
  )
}
