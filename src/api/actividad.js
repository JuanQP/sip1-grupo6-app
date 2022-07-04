import axios from 'axios';
import { environment } from '../../environments/environment';

const baseUrl = environment.baseUrl;

/*
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

export async function createOrUpdateActividad(actividad) {
  const axiosMethod = actividad.id ? axios.patch : axios.post;
  const response = await axiosMethod(`/api/actividads/${actividad.id ?? ''}`, actividad);
  return response.data.actividad;
}
*/

export async function getActividad(actividadId) {
  const response = await axios.get(`${baseUrl}/api/actividad/${actividadId}`);
  return response.data;
}

export async function getActividadMismaHora(datetime) {
  const response = await axios.get(`${baseUrl}/api/actividads-same-hour/`, { params: { datetime } });
  return response.data.actividads;
}

export async function updateActividad(actividad) {
  const response = await axios.patch(`${baseUrl}/api/actividad-log/${actividad.id}`, actividad);
  return response.data.actividad;
}

export async function createOrUpdateActividad(actividad) {
  const axiosMethod = actividad.id ? axios.patch : axios.post;
  const response = await axiosMethod(`${baseUrl}/api/actividads/${actividad.id ?? ''}`, actividad);
  return response.data.actividad;
}
