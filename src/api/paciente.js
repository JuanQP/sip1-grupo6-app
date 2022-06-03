import axios from 'axios';

export async function getPacientes() {
  const response = await axios.get('/api/pacientes');
  return response.data;
}

export async function createPaciente(paciente) {
  const response = await axios.post('/api/pacientes', paciente);
  return response.data;
}