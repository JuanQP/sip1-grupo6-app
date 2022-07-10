import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/Login';
import FamiliarHome from '../screens/FamiliarHome';
import AppTabs from '../screens/Tabs/AppTabs';
import PacienteStack from '../screens/Tabs/PacienteStack';
import FamiliarGlosarioScreen from '../screens/FamiliarGlosarioScreen';
import DetalleCuidadorScreen from '../screens/Familiar/DetalleCuidador';
import DetallePacienteScreen from '../screens/Familiar/DetallePaciente';

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
        name="AppTabs"
        component={AppTabs}
        options={{headerShown: false }}
      />
      <Stack.Screen
        name="PacienteStack"
        component={PacienteStack}
        options={{headerShown: false }}
      />
      <Stack.Screen
        name="FamiliarHome"
        component={FamiliarHome}
        options={{ title: 'Familiar' }}
      />
      <Stack.Screen
        name="FamiliarGlosario"
        component={FamiliarGlosarioScreen}
        options={{ title: 'Glosario Familiar' }}
      />
      <Stack.Screen
        name="FamiliarDetalleCuidador"
        component={DetalleCuidadorScreen}
        options={{ title: 'Detalle Cuidador' }}
      />
      <Stack.Screen
        name="FamiliarDetallePaciente"
        component={DetallePacienteScreen}
        options={{ title: 'Detalle Paciente' }}
      />
    </Stack.Navigator>
  )
}
