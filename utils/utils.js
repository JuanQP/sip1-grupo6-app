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
export function momentToMarkedDate(moment, colors) {
  return {
    date: moment,
    dots: [{
      color: colors.primary,
      selectedColor: 'white',
    }],
  };
}

export function formatearFecha(moment) {
  return moment.format("dddd[, ]DD[ de ]MMMM[, ]YYYY").toUpperCase();
}
