import axios from 'axios';
import { environment } from '../../environments/environment';

const baseUrl = environment.baseUrl;

/*
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
*/

export async function getPacientes() {
  const response = await axios.get(`${baseUrl}/api/pacientes`);
  return response.data;
}

export async function createPaciente(paciente) {
  const response = await axios.post(`${baseUrl}/api/pacientes`, paciente);
  return response.data;
}

export async function updatePaciente(paciente) {
  const response = await axios.patch(`${baseUrl}/api/pacientes/${paciente.pacienteId}`, paciente);
  return response.data;
}

export async function getPacienteActividades(pacienteId, fecha) {
  const response = await axios.get(`${baseUrl}/api/actividades-log/${pacienteId}/${fecha}`);
  return response.data;
}

export async function getPaciente(pacienteId) {
  try {
    const response = await axios.get(`${baseUrl}/api/paciente/${pacienteId}`);
    return response.data;
  }
  catch(err) {
    console.error(err)
  }
}

export async function getPacientePredeterminado() {
  try {
    const response = await axios.get(`${baseUrl}/api/paciente-predeterminado`);
    return response.data;
  }
  catch(err) {
    console.error(err)
  }
}
