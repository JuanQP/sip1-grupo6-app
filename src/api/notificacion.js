import axios from 'axios';
import { environment } from '../../environments/environment';

const baseUrl = environment.baseUrl;

/*
export async function getNotificaciones() {
  const response = await axios.get('/api/notificaciones');
  return response.data;
}
*/

export async function getNotificaciones() {
  const response = await axios.get(`${baseUrl}/api/notificaciones`);
  return response.data;
}

export async function updateNotificaciones(notificaciones) {
  const response = await axios.patch(`${baseUrl}/api/notificaciones`, notificaciones);
  return response.data;
}