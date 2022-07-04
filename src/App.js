import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/Login';
import FamiliarHome from '../screens/FamiliarHome';
import AppTabs from '../screens/Tabs/AppTabs';

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
        name="FamiliarHome"
        component={FamiliarHome}
        options={{ title: 'Familiar' }}
      />
    </Stack.Navigator>
  )
}
