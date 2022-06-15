import axios from 'axios';

export async function getHome() {
  const response = await axios.get('/api/familiar-home');
  return response.data;
}
