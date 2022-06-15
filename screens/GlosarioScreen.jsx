import React from 'react';
import { ScrollView } from 'react-native';
import { Surface, Text, useTheme } from 'react-native-paper';
import GlosarioItem from '../components/Glosario/GlosarioItem';
import NavbarLayout from '../layouts/NavbarLayout';
import { imagenes } from '../utils/utils';

const completada = imagenes['completada'];
const pendiente = imagenes['pendiente'];
const pospuesta = imagenes['pospuesta'];

function GlosarioScreen({ navigation, route }) {
  const { esCuidador } = route.params;
  const { colors } = useTheme();

  function handleMisPacientesPress() {
    navigation.navigate('MisPacientes');
  }

  return (
    <NavbarLayout
      title="Glosario"
      onMisPacientesPress={handleMisPacientesPress}
    >
      <Surface style={{flex: 1, padding: 10}}>
        <ScrollView>
          {esCuidador && (
            <>
              <GlosarioItem icono="phone-plus">
                Mantenga presionado por unos segundos para notificar al familiar predeterminado que ocurrió una emergencia y debe comunicarse a la brevedad.
              </GlosarioItem>
              <GlosarioItem icono="lock-outline">
                Seleccione para elegir su <Text style={{ fontWeight: 'bold' }}>paciente predeterminado.</Text>
              </GlosarioItem>
              <GlosarioItem icono="phone-outline">
                Seleccione para elegir el <Text style={{ fontWeight: 'bold' }}>familiar predeterminado</Text> de su paciente.
              </GlosarioItem>
            </>
          )}
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
          {esCuidador && (
            <>
              <GlosarioItem icono="clock-outline" color={colors.primary} transparentBackground>
                Seleccione para cambiar el estado de la actividad a <Text style={{ fontWeight: 'bold' }}>Pendiente</Text>.
              </GlosarioItem>
              <GlosarioItem icono="check-circle-outline" color={colors.primary} transparentBackground>
                Seleccione para cambiar el estado de la actividad a <Text style={{ fontWeight: 'bold' }}>Completada</Text>.
              </GlosarioItem>
              <GlosarioItem icono="alert-circle-outline" color={colors.primary} transparentBackground>
                Seleccione para cambiar el estado de la actividad a <Text style={{ fontWeight: 'bold' }}>Pospuesta</Text>.
                Se notificará a los familiares vinculados al paciente indicando el motivo, si lo hubiese.
              </GlosarioItem>
            </>

          )}
          <GlosarioItem icono="eye-outline" color={colors.primary} transparentBackground>
            Seleccione para ver el perfil o la actividad.
          </GlosarioItem>
          {esCuidador && (
            <GlosarioItem icono="square-edit-outline" color={colors.primary} transparentBackground>
              Seleccione para editar el perfil o la actividad.
            </GlosarioItem>
          )}
        </ScrollView>
      </Surface>
    </NavbarLayout>
  );
}

export default GlosarioScreen
