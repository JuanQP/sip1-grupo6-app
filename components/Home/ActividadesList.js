import { FlatList } from "react-native";
import ActividadRow from "./ActividadRow";

function ActividadesList({ actividades, mostrarPaciente = false, onActividadClick }) {
  return (
    <FlatList
      data={actividades}
      renderItem={({ item }) =>
        <ActividadRow
          onActividadClick={onActividadClick}
          actividad={item}
          mostrarPaciente={mostrarPaciente}
        />
      }
      keyExtractor={actividad => actividad.id}
    />
  );
}

export default ActividadesList;