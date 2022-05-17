import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/Home';
import MisPacientesScreen from '../screens/MisPacientes';
import LoginScreen from '../screens/Login';
import NuevaActividadScreen from '../screens/NuevaActividad/NuevaActividadScreen';
import NuevaMedicacionScreen from '../screens/NuevaActividad/NuevaMedicacionScreen';
import NuevaConsultaScreen from '../screens/NuevaActividad/NuevaConsultaScreen';
import NuevoEstudioScreen from '../screens/NuevaActividad/NuevoEstudioScreen';
import NuevoOtroScreen from '../screens/NuevaActividad/NuevoOtroScreen';
import PacienteDetailScreen from '../screens/Paciente/PacienteDetailScreen';

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
        name="NuevaMedicacion"
        component={NuevaMedicacionScreen}
        options={{ title: 'Nueva Medicación' }}
      />
      <Stack.Screen
        name="NuevaConsulta"
        component={NuevaConsultaScreen}
        options={{ title: 'Nueva Consulta' }}
      />
      <Stack.Screen
        name="NuevoEstudio"
        component={NuevoEstudioScreen}
        options={{ title: 'Nuevo Estudio' }}
      />
      <Stack.Screen
        name="NuevoOtro"
        component={NuevoOtroScreen}
        options={{ title: 'Otro tipo de Actividad' }}
      />
      <Stack.Screen
        name="PacienteDetail"
        component={PacienteDetailScreen}
        options={{ title: 'Mi Paciente' }}
      />
    </Stack.Navigator>
  )
}
