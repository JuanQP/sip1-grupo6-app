import { useEffect, useState } from "react";
import { List, withTheme } from "react-native-paper";
import PacienteItem from "./PacienteItem";


function PacienteList({ pacientes, onPacienteClick, ...props }) {

  const { colors } = props.theme;

  return (
    <List.Section style={{ backgroundColor: colors.surface }}>
     {Array.from(pacientes).map(p =>
        <PacienteItem
          key={p.pacienteId}
          paciente={p}
          isSelected={p.esPacientePredeterminado}
          onPacienteClick={onPacienteClick}
        />
      )}
    </List.Section>
  );
}

export default withTheme(PacienteList);
