import axios from 'axios';

export async function login(credentials) {
  const response = await axios.post('/api/login', credentials);
  return response.data;
}

export async function getMiSemana() {
  const response = await axios.get('/api/mi-semana');
  return response.data;
}
