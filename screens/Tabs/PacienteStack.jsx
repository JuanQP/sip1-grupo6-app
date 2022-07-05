import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MisPacientesScreen from '../../screens/MisPacientes';
import HomeScreen from "../../screens/Home";
import ActividadesScreen from '../../screens/Actividades/ActividadesScreen';
import MedicacionScreen from '../../screens/Actividades/MedicacionScreen';
import ConsultaScreen from '../../screens/Actividades/ConsultaScreen';
import EstudioScreen from '../../screens/Actividades/EstudioScreen';
import OtroScreen from '../../screens/Actividades/OtroScreen';
import PacienteScreen from '../../screens/PacienteScreen';
import NuevoPacienteScreen from '../../screens/Pacientes/NuevoPacienteScreen';
import FamiliarScreen from '../../screens/FamiliarScreen';
import NotificacionesScreen from '../../screens/Notificaciones';

const Stack = createNativeStackNavigator();

export default function PacienteStack() {
  return (
    <Stack.Navigator initialRouteName="Home" screenOptions={{headerShown: false}}>
      <Stack.Screen
        name="MisPacientes"
        component={MisPacientesScreen}
        options={{ title: 'Mis Pacientes' }}
      />
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'Actividades' }}
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
        name="Paciente"
        component={PacienteScreen}
        options={{ title: 'Mi Paciente' }}
      />
      <Stack.Screen
        name="NuevoPaciente"
        component={NuevoPacienteScreen}
        options={{ title: 'Nuevo Paciente' }}
      />
      <Stack.Screen
        name="FamiliarScreen"
        component={FamiliarScreen}
        options={{ title: 'Familiar' }}
      />
      <Stack.Screen
        name="Notificaciones"
        component={NotificacionesScreen}
        options={{ title: 'Familiar' }}
      />
    </Stack.Navigator>
  )
}
