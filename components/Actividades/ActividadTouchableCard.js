import { IconButton, Surface, Text } from "react-native-paper";
import { StyleSheet } from "react-native";

function ActividadTouchableCard({ title, icon, color, onPress }) {
  return (
    <Surface style={styles.card} onTouchStart={onPress}>
      <Text>{title}</Text>
      <IconButton color={color} icon={icon} />
    </Surface>
  );
}

const styles = StyleSheet.create({
  card: {
    height: 100,
    margin: 10,
    elevation: 4,
    flex: 1,
    alignItems: "center",
    justifyContent: 'center',
  },
});

export default ActividadTouchableCard;