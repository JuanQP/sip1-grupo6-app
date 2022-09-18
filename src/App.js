import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/Home';
import MisPacientesScreen from '../screens/MisPacientes';
import LoginScreen from '../screens/Login';
import ActividadesScreen from '../screens/Actividades/ActividadesScreen';
import MedicacionScreen from '../screens/Actividades/MedicacionScreen';
import ConsultaScreen from '../screens/Actividades/ConsultaScreen';
import EstudioScreen from '../screens/Actividades/EstudioScreen';
import OtroScreen from '../screens/Actividades/OtroScreen';
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
        name="Actividad"
        component={ActividadesScreen}
        options={{ title: 'Actividad' }}
      />
      <Stack.Screen
        name="Medicacion"
        component={MedicacionScreen}
        options={{ title: 'Medicación' }}
      />
      <Stack.Screen
        name="Consulta"
        component={ConsultaScreen}
        options={{ title: 'Consulta' }}
      />
      <Stack.Screen
        name="Estudio"
        component={EstudioScreen}
        options={{ title: 'Estudio' }}
      />
      <Stack.Screen
        name="Otro"
        component={OtroScreen}
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
