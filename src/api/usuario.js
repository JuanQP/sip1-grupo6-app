import axios from 'axios';
import { environment } from '../../environments/environment';

const baseUrl = environment.baseUrl;

/*
export async function login(credentials) {
  const response = await axios.post('/api/login', credentials);
  return response.data;
}

export async function getMiSemana() {
  const response = await axios.get('/api/mi-semana');
  return response.data;
}
*/

export async function login(credentials) {
  const response = await axios.post(`${baseUrl}/api/login`, credentials);
  return response.data;
}

export async function updateUsuario(credentials) {
  const response = await axios.patch(`${baseUrl}/api/usuario`, credentials);
  return response.data;
}

export async function getMiSemana() {
  const response = await axios.get(`${baseUrl}/api/mi-semana`);
  return response.data;
}
