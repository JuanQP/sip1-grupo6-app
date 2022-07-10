import React from 'react';
import { View } from 'react-native';
import { Appbar, Avatar, Divider, Text, Title } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { imagenes } from '../../utils/utils';

function DetallePacienteScreen() {
  return (
    <>
      <Appbar.Header>
        <Appbar.Content title="Paciente" />
      </Appbar.Header>
      <SafeAreaView style={{paddingHorizontal: 10}}>
        <View style={{alignItems: 'center'}}>
          <Avatar.Image size={64} source={imagenes['mirta.png']} />
          <Title>Mirta Pérez</Title>
        </View>
        <Divider style={{marginVertical: 10}}/>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text>Fecha de Nacimiento</Text>
          <Text>10/04/1940</Text>
        </View>
        <Divider style={{marginVertical: 10}}/>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text>Sexo</Text>
          <Text>Femenino</Text>
        </View>
        <Divider style={{marginVertical: 10}}/>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text>Documento</Text>
          <Text>DNI 12.678.345</Text>
        </View>
        <Divider style={{marginVertical: 10}}/>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text>Teléfono de Contacto</Text>
          <Text>+54 11 4321 5678</Text>
        </View>
        <Divider style={{marginVertical: 10}}/>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text>Provincia</Text>
          <Text>Buenos Aires</Text>
        </View>
        <Divider style={{marginVertical: 10}}/>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text>Localidad</Text>
          <Text>Tigre</Text>
        </View>
        <Divider style={{marginVertical: 10}}/>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text>Dirección</Text>
          <Text>Av. Victorica 800, 2B</Text>
        </View>
        <Divider style={{marginVertical: 10}}/>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text>Obra Social</Text>
          <Text>Swiss Medical</Text>
        </View>
        <Divider style={{marginVertical: 10}}/>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text>Número de Afiliado</Text>
          <Text>12567810901</Text>
        </View>
        <Divider style={{marginVertical: 10}}/>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text>Cuidadora</Text>
          <Text>Nancy González</Text>
        </View>
      </SafeAreaView>
    </>
  );
}

export default DetallePacienteScreen;
