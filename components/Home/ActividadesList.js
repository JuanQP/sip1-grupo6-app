import { FlatList } from "react-native";
import ActividadRow from "./ActividadRow";

function ActividadesList({ actividades, readOnly, mostrarPaciente = false, onActividadClick }) {
  return (
    <FlatList
      data={actividades}
      renderItem={({ item }) =>
        <ActividadRow
          onActividadClick={onActividadClick}
          actividad={item}
          mostrarPaciente={mostrarPaciente}
          readOnly={readOnly}
        />
      }
      keyExtractor={actividad => actividad.id}
    />
  );
}

export default ActividadesList;
