import axios from 'axios';

export async function getDias() {
  const response = await axios.get(`/api/dias/`);
  return response.data.dia;
}
