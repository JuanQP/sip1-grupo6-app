import axios from 'axios';

export async function login(credentials) {
  const response = await axios.post('/api/login', credentials);
  return response.data;
}
