import { FlatList } from "react-native";
import ActividadRow from "./ActividadRow";

function ActividadesList({ actividades, onActividadClick }) {
  return (
    <FlatList
      data={actividades}
      renderItem={({ item }) =>
        <ActividadRow
          onActividadClick={onActividadClick}
          actividad={item}
        />
      }
      keyExtractor={actividad => actividad.id}
    />
  );
}

export default ActividadesList;