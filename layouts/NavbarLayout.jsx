import React from 'react'
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { Appbar, withTheme } from 'react-native-paper';
import 'moment/locale/es';

function AppbarLayout({ title, navigation, route, onMisPacientesPress, ...props }) {
  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title={title} />
        <Appbar.Action icon="account-group" onPress={onMisPacientesPress} />
      </Appbar.Header>
      {props.children}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default withTheme(AppbarLayout);
