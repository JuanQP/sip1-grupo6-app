import axios from 'axios';

export async function getActividad(actividadId) {
  const response = await axios.get(`/api/actividads/${actividadId}`);
  return response.data.actividad;
}

export async function getActividadMismaHora(datetime) {
  const response = await axios.get(`/api/actividads-same-hour/`, { params: { datetime } });
  return response.data.actividads;
}

export async function updateActividad(actividad) {
  const response = await axios.patch(`/api/actividads/${actividad.id}`, actividad);
  return response.data.actividad;
}

export async function updateActividadLog(actividadLog) {
  const id = actividadLog['_parts'][0][1];
  const auth = axios.defaults.headers.common['Authorization'];

  const response = await fetch(`/api/actividad-log/${id}`, {
    method: 'PATCH',
    body: actividadLog,
    headers: {
      Accept: 'application/json',
      Authorization: auth,
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data.actividad;
}

export async function createOrUpdateActividad(actividad) {
  const axiosMethod = actividad.id ? axios.patch : axios.post;
  const response = await axiosMethod(`/api/actividads/${actividad.id ?? ''}`, actividad);
  return response.data.actividad;
}
