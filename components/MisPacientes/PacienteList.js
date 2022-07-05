import { useEffect, useState } from "react";
import { List, withTheme } from "react-native-paper";
import { useQuery } from 'react-query';
import { getProvincias } from "../../src/api/dropdown";
import PacienteItem from "./PacienteItem";


function PacienteList({ selectedId, pacientes, onPacienteClick, ...props }) {

  const { colors } = props.theme;

  useEffect(() => {
    getProvincias()
    .then((res) => {
      Array.from(pacientes).map(p => {
        p.provincia = Array.from(res).find(prov => prov.id == p.provinciaId)
      });
    })
    .catch((err) => console.error(err))
  }, []);

  return (
    <List.Section style={{ backgroundColor: colors.surface }}>
     {Array.from(pacientes).map(p =>
        <PacienteItem
          key={p.id}
          paciente={p}
          isSelected={p.id === selectedId}
          onPacienteClick={onPacienteClick}
        />
      )}
    </List.Section>
  );
}

export default withTheme(PacienteList);