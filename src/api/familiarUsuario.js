import axios from 'axios';
import { environment } from '../../environments/environment';

const baseUrl = environment.baseUrl;

/*
export async function getHome() {
  const response = await axios.get('/api/familiar-home');
  return response.data;
}
*/

export async function getHome() {
  const response = await axios.get(`${baseUrl}/api/paciente-familiar`);
  return response.data;
}