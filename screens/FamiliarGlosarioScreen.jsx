import React from 'react';
import { ScrollView } from 'react-native';
import { Surface, Text, useTheme } from 'react-native-paper';
import GlosarioItem from '../components/Glosario/GlosarioItem';
import NavbarLayout from '../layouts/NavbarLayout';
import { imagenes } from '../utils/utils';

const completada = imagenes['completada'];
const pendiente = imagenes['pendiente'];
const pospuesta = imagenes['pospuesta'];

function FamiliarGlosarioScreen() {
  const { colors } = useTheme();

  return (
    <NavbarLayout title="Glosario">
      <Surface style={{flex: 1, padding: 10}}>
        <ScrollView>
          <GlosarioItem icono="pill" color={colors.disabled} transparentBackground>
            La actividad corresponde al tipo <Text style={{fontWeight: 'bold'}}>Medicación</Text>.
          </GlosarioItem>
          <GlosarioItem icono="doctor" color={colors.disabled} transparentBackground>
            La actividad corresponde al tipo <Text style={{fontWeight: 'bold'}}>Consulta Médica</Text>.
          </GlosarioItem>
          <GlosarioItem icono="hospital-building" color={colors.disabled} transparentBackground>
            La actividad corresponde al tipo <Text style={{fontWeight: 'bold'}}>Estudio Médico</Text>.
          </GlosarioItem>
          <GlosarioItem icono="dots-horizontal" color={colors.disabled} transparentBackground>
            La actividad corresponde al tipo <Text style={{fontWeight: 'bold'}}>Otros</Text>.
          </GlosarioItem>
          <GlosarioItem icono="ninguno" imagen={pendiente} color={colors.disabled}>
            La actividad se encuentra Pendiente.
          </GlosarioItem>
          <GlosarioItem icono="ninguno" imagen={completada} color={colors.disabled}>
            La actividad ha sido Completada.
          </GlosarioItem>
          <GlosarioItem icono="ninguno" imagen={pospuesta} color={colors.disabled}>
            La actividad ha sido Pospuesta.
          </GlosarioItem>
          <GlosarioItem icono="eye-outline" color={colors.primary} transparentBackground>
            Seleccione para ver el perfil o la actividad.
          </GlosarioItem>
        </ScrollView>
      </Surface>
    </NavbarLayout>
  );
}

export default FamiliarGlosarioScreen
