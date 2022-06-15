import { Image, StyleSheet, View } from "react-native";
import { Avatar, Text } from "react-native-paper";

export default function GlosarioItem ({ icono, imagen, color, transparentBackground, children }) {

  return (
    <View style={styles.container}>
      {icono !== 'ninguno' &&
        (<Avatar.Icon
          size={48}
          icon={icono}
          color={color}
          style={transparentBackground ? {backgroundColor: 'transparent'} : undefined}
        />)
      }
      {icono === 'ninguno' && (
        <Image
          style={{height: 48, width: 48, resizeMode: 'center'}}
          size={48}
          source={imagen}
        />
      )}
      <Text style={{flexShrink: 1, marginLeft: 10}}>
        {children}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
});
