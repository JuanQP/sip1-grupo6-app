import { List } from "react-native-paper";
import FamiliarItem from "./FamiliarItem";

function FamiliaresList({ familiares, onEditFamiliar }) {
  return (
    <List.Section>
      {familiares.length === 0 ?
      <List.Item title="No hay familiares agregados" /> :
      familiares.map(f => 
        <FamiliarItem
          key={f.id}
          familiar={f}
          onEditFamiliar={onEditFamiliar}
        />
      )}
    </List.Section>
  );
}

export default FamiliaresList;