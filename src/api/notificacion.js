import axios from 'axios';

export async function getNotificaciones() {
  const response = await axios.get('/api/notificaciones');
  return response.data;
}
