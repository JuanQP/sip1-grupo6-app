import axios from 'axios';
import { mapToLabelValue } from '../../utils/utils';

export function selectDropdownItems(data) {
  return data.map(d => mapToLabelValue(d, 'descripcion', 'id'));  
}

export async function getDias() {
  const response = await axios.get(`/api/dias/`);
  return response.data.dia;
}

export async function getTiposActividades() {
  const TIPOS = [
    {descripcion: 'Medicación', id: 1},
    {descripcion: 'Consulta Médica', id: 2},
    {descripcion: 'Estudio Médico', id: 3},
    {descripcion: 'Otra', id: 4}
  ]
  return TIPOS;
}

export async function getEstados() {
  const ESTADOS = [
    {descripcion: 'Pendiente', id: 1},
    {descripcion: 'Completada', id: 2},
    {descripcion: 'Pospuesta', id: 3}
  ]
  return ESTADOS;
}

export async function getSexos() {
  const response = await axios.get(`/api/sexos/`);
  return response.data.sexos;
}
export async function getTiposDocumento() {
  const response = await axios.get(`/api/tipos-documento/`);
  return response.data.tipoDocumentos;
}
export async function getProvincias() {
  const response = await axios.get(`/api/provincias/`);
  return response.data.provincia;
}
