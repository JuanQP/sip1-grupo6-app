import React, { useState } from 'react'
import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Appbar, useTheme } from 'react-native-paper';
import FiltrosForm from '../components/Filtros/FiltrosForm';
import { updateFiltrosAplicados } from '../src/api/actividad';
import { useQuery } from 'react-query';
import { getTiposActividades, getEstados } from '../src/api/dropdown';
import { mapToLabelValue } from '../utils/utils';

function FiltrosScreen({ navigation, route }) {

  useQuery('tipos', getTiposActividades, {
    onSuccess: (tipos) => {
      setListaTipos(tipos.map(d => mapToLabelValue(d, 'descripcion', 'id')));
    }
  });
  useQuery('estados', getEstados, {
    onSuccess: (estados) => {
      setListaEstados(estados.map(d => mapToLabelValue(d, 'descripcion', 'id')));
    }
  });

  const { colors } = useTheme();
  const [initialValues, setInitialValues] = useState({
    tiposIds: [],
    estadosIds: [],
  });
  const [listaTipos, setListaTipos] = useState([]);
  const [listaEstados, setListaEstados] = useState([]);

  async function handleSubmit(formValues, actions) {
    formValues.estadosIds = formValues.estadosIds.map((estadoId) => listaEstados.find((estado) => estado.value == estadoId).label);
    formValues.tiposIds = formValues.tiposIds.map((tipoId) => listaTipos.find((tipo) => tipo.value == tipoId).label);
    updateFiltrosAplicados(formValues);
  }

  function handleBackActionClick() {
    navigation.goBack();
  }

  function handleClearState() {
    updateFiltrosAplicados({estadosIds: '', tiposIds: ''});
  }

  return (
    <View style={{ ...styles.container, backgroundColor: colors.surface }}>
      <Appbar.Header>
        <Appbar.BackAction onPress={handleBackActionClick} />
        <Appbar.Content title={'Filtros'} />
      </Appbar.Header>
      <View style={styles.formContainer}>
        <ScrollView>
          <FiltrosForm
            initialValues={initialValues}
            estados={listaEstados}
            tipos={listaTipos}
            onCancel={handleClearState}
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
    marginBottom: 60,
    justifyContent: 'center',
  },
});

export default FiltrosScreen;
