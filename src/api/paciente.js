import axios from 'axios';

export async function getPacientes() {
  const response = await axios.get('/api/pacientes');
  return response.data;
}

export async function createPaciente(paciente) {
  const response = await axios.post('/api/pacientes', paciente);
  return response.data;
}

export async function updatePaciente(paciente) {
  const response = await axios.patch(`/api/pacientes/${paciente.id}`, paciente);
  return response.data.paciente;
}

export async function getPacienteActividades(pacienteId) {
  const response = await axios.get('/api/actividads', { params: { pacienteId } });
  return response.data.actividades;
}

export async function getPaciente(pacienteId) {
  const response = await axios.get(`/api/pacientes/${pacienteId}`);
  return response.data.paciente;
}