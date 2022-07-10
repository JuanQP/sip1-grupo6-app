import { useState } from 'react';
import moment from 'moment';

export const formatoFechas = "YYYY-MM-DD HH:mm:ss";

export const imagenes = {
  'mirta.png': require('../assets/mirta.png'),
  'andras.png': require('../assets/andras.png'),
  'nancy.jpg': require('../assets/nancy.jpg'),
  'VITALITY_LOGO_TEXT.png': require('../assets/VITALITY_LOGO_TEXT.png'),
  'completada': require('../assets/completada.png'),
  'pendiente': require('../assets/pendiente.png'),
  'pospuesta': require('../assets/pospuesta.png'),
};

/**
 * Mapea una fecha a un objeto para ser usado por Calendar Strip
 * @param {moment.Moment} moment La fecha a ser convertida
 * @returns Un objeto del tipo fecha marcada
 */
export function stringToMomentMarkedDate(momentString, colors) {
  return {
    date: moment(momentString, formatoFechas),
    dots: [{
      color: colors.primary,
      selectedColor: 'white',
    }],
  };
}

export function formatearFecha(moment) {
  return moment.format("dddd[, ]DD[ de ]MMMM[, ]YYYY").toUpperCase();
}

export function getProvincias() {
  const provincias = [
    {descripcion: 'CABA', id: 1},
    {descripcion: 'Buenos Aires', id: 2},
    {descripcion: 'Catamarca', id: 3},
    {descripcion: 'Chaco', id: 4},
    {descripcion: 'Chubut', id: 5},
    {descripcion: 'Córdoba', id: 6},
    {descripcion: 'Corrientes', id: 7},
    {descripcion: 'Entre Ríos', id: 8},
    {descripcion: 'Formosa', id: 9},
    {descripcion: 'Jujuy', id: 10},
    {descripcion: 'La Pampa', id: 11},
    {descripcion: 'La Rioja', id: 12},
    {descripcion: 'Mendoza', id: 13},
    {descripcion: 'Misiones', id: 14},
    {descripcion: 'Neuquén', id: 15},
    {descripcion: 'Río Negro', id: 16},
    {descripcion: 'Salta', id: 17},
    {descripcion: 'San Juan', id: 18},
    {descripcion: 'San Luis', id: 19},
    {descripcion: 'Santa Cruz', id: 20},
    {descripcion: 'Santa Fe', id: 21},
    {descripcion: 'Santiago del Estero', id: 22},
    {descripcion: 'Tierra del Fuego', id: 23},
    {descripcion: 'Tucumán', id: 24}
  ];
  return provincias;
}

export function random(inicio, fin) {
  return Math.floor(Math.random() * (fin - inicio)) + inicio;
}

export function pickRandom(list) {
  return list[random(0, list.length)];
}

export function dateSort(a, b) {
  return moment(a.fecha).diff(moment(b.fecha));
}

export function mapToLabelValue(object, labelKey = 'descripcion', valueKey = 'id') {
  return {label: object[labelKey], value: object[valueKey].toString()};
}

export function keyExtractor(object) {
  return object.id;
}

export function useToggle(defaultValue) {
  const [value, setValue] = useState(defaultValue);

  function toggleValue(value) {
    setValue(current =>
      typeof value === "boolean" ? value : !current
    );
  }

  return [value, toggleValue];
}

/**
 * Mapea de la siguiente forma "Lunes,Miércoles,Viernes" => ["1", "3", "5"]
 * @param {*} diasSemana
 * @param {*} dias
 * @returns
 */
export function diasSemanaAIds(diasSemana, dias) {
  // {Lunes: 1, Martes: 2, ...}
  const diasDiccionario = Object.fromEntries(dias.map(d => [d.descripcion, d.id]));

  return diasSemana
    .split(',')
    .map(dia => String(diasDiccionario[dia].id));
}

/**
 * Mapea de la siguiente forma ["1", "3", "5"] => "Lunes,Miércoles,Viernes"
 * @param {*} ids
 * @param {*} dias
 * @returns
 */
export function idsADiasSemana(diaIds, dias) {
  const diaIdsNumber = diaIds.map(Number);
  return dias
    .filter(d => diaIdsNumber.includes(d.id))
    .map(d => d.descripcion)
    .join(',');
}
