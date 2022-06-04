import axios from 'axios';

export async function getFamiliar(familiarId) {
  const response = await axios.get(`/api/familiars/${familiarId}`);
  return response.data.familiar;
}

export async function saveFamiliar(familiar) {
  return familiar.id ? updateFamiliar(familiar) : createFamiliar(familiar);
}

export async function createFamiliar(familiar) {
  const response = await axios.post('/api/familiars', familiar);
  return response.data.familiar;
}

export async function updateFamiliar(familiar) {
  const response = await axios.patch(`/api/familiars/${familiar.id}`, familiar);
  return response.data.familiar;
}