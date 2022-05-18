import moment from 'moment';

export const formatoFechas = "YYYY-MM-DD HH:mm:ss";

export const imagenes = {
  'mirta.png': require('../assets/mirta.png'),
  'andras.png': require('../assets/andras.png'),
};

/**
 * Una lista de números del 0 al "size"
 * @param {*} size
 * @returns number[]
 */
export function range(size) {
  return [...Array(size).keys()];
}

/**
 * Devuelve un rango de fechas
 * @param {moment.Moment} start_date
 * @param {moment.Moment} end_date
 * @returns moment.Moment[]
 */
export function momentRange(start_date, end_date) {
  const daysCount = end_date.diff(start_date, 'days');
  return [
    ...range(daysCount).map(i => start_date.clone().add(i, 'days')),
  ];
}

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