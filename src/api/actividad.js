import axios from 'axios';

export async function updateActividad(actividad) {
  const response = await axios.patch(`/api/actividads/${actividad.id}`, actividad);
  return response.data.actividad;
}
