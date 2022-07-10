import React from 'react';
import { View } from 'react-native';
import { Appbar, Avatar, Divider, Text, Title } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { imagenes } from '../../utils/utils';

function DetalleCuidadorScreen() {
  return (
    <>
      <Appbar.Header>
        <Appbar.Content title="Cuidadora" />
      </Appbar.Header>
      <SafeAreaView style={{paddingHorizontal: 10}}>
        <View style={{alignItems: 'center'}}>
          <Avatar.Image size={64} source={imagenes['nancy.jpg']} />
          <Title>Nancy González</Title>
        </View>
        <Divider style={{marginVertical: 10}}/>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text>Fecha de Nacimiento</Text>
          <Text>20/04/1996</Text>
        </View>
        <Divider style={{marginVertical: 10}}/>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text>Sexo</Text>
          <Text>Femenino</Text>
        </View>
        <Divider style={{marginVertical: 10}}/>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text>Documento</Text>
          <Text>DNI 34.678.345</Text>
        </View>
        <Divider style={{marginVertical: 10}}/>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text>Teléfono de Contacto</Text>
          <Text>+54 11 5678 4321</Text>
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
          <Text>Av. Alberdi 900, PB</Text>
        </View>
      </SafeAreaView>
    </>
  );
}

export default DetalleCuidadorScreen;
