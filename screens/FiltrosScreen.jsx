import React, { useState } from 'react'
import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Appbar, withTheme } from 'react-native-paper';
import FiltrosForm from '../components/Filtros/FiltrosForm';


function FiltrosScreen({ navigation, route, ...props }) {
    const { colors } = props.theme;
    const [initialValues, setInitialValues] = useState({
        tiposIds: [],
        estadosIds: [],
    });
  
  
    async function handleSubmit(formValues, actions) {
        // Logica para filtrar
    }
  
    function handleBackActionClick() {
      navigation.goBack();
    }

    function handleClearState() {
        // Logica para resetear
    }
  
    return (
      <View style={{...styles.container, backgroundColor: colors.surface}}>
        <Appbar.Header>
          <Appbar.BackAction onPress={handleBackActionClick} />
          <Appbar.Content title={'Filtros'} />
        </Appbar.Header>
        <View style={styles.formContainer}>
          <ScrollView>
            <FiltrosForm
              initialValues={initialValues}
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
  
  export default withTheme(FiltrosScreen);
  