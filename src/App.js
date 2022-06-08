import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/Home';
import MisPacientesScreen from '../screens/MisPacientes';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
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
    </Stack.Navigator>
  )
}
