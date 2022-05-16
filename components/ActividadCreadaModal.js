import { StyleSheet, View } from "react-native";
import { IconButton, Modal, Paragraph, withTheme } from "react-native-paper"

function ActividadCreadaModal({ visible, onDismiss, ...props }) {

  const { colors } = props.theme;
  const modalStyles = {
    margin: 20,
    backgroundColor: colors.surface,
    borderRadius: 10,
  };

  return (
    <Modal
      contentContainerStyle={modalStyles}
      visible={visible}
      onDismiss={onDismiss}
    >
      <View style={{...styles.header}}>
        <IconButton icon="close" mode="text" onPress={onDismiss} />
      </View>
      <View style={styles.contenido}>
        <IconButton
          style={{margin: 0}}
          color={colors.primary}
          icon="check"
          size={64}
        />
        <Paragraph>¡Nueva actividad creada exitosamente!</Paragraph>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  contenido: {
    paddingBottom: 20,
    alignItems: 'center',
  },
});

export default withTheme(ActividadCreadaModal);
