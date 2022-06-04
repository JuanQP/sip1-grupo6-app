import axios from 'axios';

export async function getActividad(actividadId) {
  const response = await axios.get(`/api/actividads/${actividadId}`);
  return response.data.actividad;
}

export async function updateActividad(actividad) {
  const response = await axios.patch(`/api/actividads/${actividad.id}`, actividad);
  return response.data.actividad;
}

export async function createOrUpdateActividad(actividad) {
  const axiosMethod = actividad.id ? axios.patch : axios.post;
  const response = await axiosMethod(`/api/actividads/${actividad.id ?? ''}`, actividad);
  return response.data.actividad;
}
