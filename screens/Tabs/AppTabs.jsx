import React from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { Text, useTheme } from 'react-native-paper';
import OverviewScreen from '../OverviewScreen';
import GlosarioScreen from '../GlosarioScreen';
import PacienteStack from './PacienteStack';
import FiltrosScreen from '../FiltrosScreen';

const Tab = createMaterialBottomTabNavigator();

function TextComponent() {
  return (
    <Text>Página de filtros</Text>
  )
}

export default function AppTabs({ route }) {
  const { colors } = useTheme();
  const { esFamiliar } = route.params;
  return (
    <Tab.Navigator
      initialRouteName='Overview'
      activeColor={colors.primary}
      inactiveColor={colors.disabled}
      barStyle={{backgroundColor: colors.surface}}
    >
      <Tab.Screen
        name="Overview"
        component={OverviewScreen}
        options={{tabBarIcon: 'calendar-month-outline', tabBarLabel: 'Mi Semana'}}
      />
      <Tab.Screen
        name="Glosario"
        component={GlosarioScreen}
        options={{tabBarIcon: 'book-alphabet', tabBarLabel: 'Glosario'}}
        initialParams={{esFamiliar}}
      />
      <Tab.Screen
        name="Filtros"
        component={FiltrosScreen}
        options={{tabBarIcon: 'filter-outline', tabBarLabel: 'Filtros'}}
      />
      <Tab.Screen
        name="PacienteStack"
        component={PacienteStack}
        options={{tabBarIcon: 'account-outline', tabBarLabel: 'Mi Paciente'}}
      />
    </Tab.Navigator>
  );
}
