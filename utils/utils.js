import { useState } from 'react';
import moment from 'moment';

export const formatoFechas = "YYYY-MM-DD HH:mm:ss";

export const imagenes = {
  'mirta.png': require('../assets/mirta.png'),
  'andras.png': require('../assets/andras.png'),
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
  return {label: object[labelKey], value: object[valueKey]};
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
