import React, { useState } from 'react'
import { StatusBar } from 'expo-status-bar';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import {
  Appbar,
  withTheme
} from 'react-native-paper';
import FamiliarForm from '../components/Familiares/FamiliarForm';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { getFamiliar, saveFamiliar } from '../src/api/familiar';

function FamiliarScreen({ navigation, route, ...props }) {
  const { colors } = props.theme;
  const { familiarId, pacienteId } = route.params;
  const queryClient = useQueryClient();
  const { mutate, isLoading: isFamiliarLoading } = useMutation(saveFamiliar);
  const [initialValues, setInitialValues] = useState({
    id: undefined,
    nombre: '',
    relacion: '',
    provinciaId: '1',
    localidad: '',
    telefono: '',
    esContactoDeEmergencia: false,
  });
  useQuery('familiar',
    () => getFamiliar(familiarId),
    {
      onSuccess: (data) => {
        const { provincia, ...familiar } = data;
        setInitialValues({
          ...familiar,
          provinciaId: provincia.id,
          pacienteId,
        });
      },
      enabled: !!familiarId,
    },
  );

  async function handleSubmit(familiar, actions) {
    const nuevoFamiliar = {
      ...familiar,
      pacienteId
    };
    mutate(nuevoFamiliar, {
      onSuccess: (data) => {
        const {provincia, ...nuevoFamiliar} = data;
        navigation.setParams({ familiarId: nuevoFamiliar.id });
        actions.setValues({
          ...nuevoFamiliar,
          provinciaId: provincia.id,
          pacienteId,
        });
        queryClient.invalidateQueries(['paciente']);
        queryClient.invalidateQueries(['familiar']);
        Alert.alert("✅", "Familiar guardado");
      },
    });
  }

  function handleBackActionClick() {
    navigation.goBack();
  }

  function handleCancel() {
    navigation.goBack();
  }

  return (
    <View style={{...styles.container, backgroundColor: colors.surface}}>
      <Appbar.Header>
        <Appbar.BackAction onPress={handleBackActionClick} />
        <Appbar.Content title="Familiar" />
      </Appbar.Header>
      <View style={styles.formContainer}>
        <ScrollView>
          <FamiliarForm
            initialValues={initialValues}
            loading={isFamiliarLoading}
            onCancel={handleCancel}
            onSubmit={handleSubmit}
          />
        </ScrollView>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  formContainer: {
    padding: 20,
    marginBottom: 80,
    justifyContent: 'center',
  },
});

export default withTheme(FamiliarScreen);
