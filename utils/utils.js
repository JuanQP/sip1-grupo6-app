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

export const listaDias = [
  {
    label: 'Lunes',
    value: 'lunes',
  },
  {
    label: 'Martes',
    value: 'martes',
  },
  {
    label: 'Miércoles',
    value: 'miercoles',
  },
  {
    label: 'Jueves',
    value: 'jueves',
  },
  {
    label: 'Viernes',
    value: 'viernes',
  },
  {
    label: 'Sábado',
    value: 'sabado',
  },
  {
    label: 'Domingo',
    value: 'domingo',
  }
];

export const listaSexos = [
  {
    label: 'Masculino',
    value: 'masculino',
  },
  {
    label: 'Femenino',
    value: 'femenino',
  },
  {
    label: 'Otro',
    value: 'otro',
  },
];


export const listaTiposDocumentos = [
  {
    label: 'DNI',
    value: 'dni',
  },
  {
    label: 'Libreta Cívica',
    value: 'lc',
  },
  {
    label: 'Libreta de Enrolamiento',
    value: 'le',
  },
  {
    label: 'Cédula de Identidad',
    value: 'ci',
  },
]

export const listaProvincias = [
  {label: 'CABA', value: 'CABA'},
  {label: 'Buenos Aires', value: 'Buenos Aires'},
  {label: 'Catamarca', value: 'Catamarca'},
  {label: 'Chaco', value: 'Chaco'},
  {label: 'Chubut', value: 'Chubut'},
  {label: 'Córdoba', value: 'Córdoba'},
  {label: 'Corrientes', value: 'Corrientes'},
  {label: 'Entre Ríos', value: 'Entre Ríos'},
  {label: 'Formosa', value: 'Formosa'},
  {label: 'Jujuy', value: 'Jujuy'},
  {label: 'La Pampa', value: 'La Pampa'},
  {label: 'La Rioja', value: 'La Rioja'},
  {label: 'Mendoza', value: 'Mendoza'},
  {label: 'Misiones', value: 'Misiones'},
  {label: 'Neuquén', value: 'Neuquén'},
  {label: 'Río Negro', value: 'Río Negro'},
  {label: 'Salta', value: 'Salta'},
  {label: 'San Juan', value: 'San Juan'},
  {label: 'San Luis', value: 'San Luis'},
  {label: 'Santa Cruz', value: 'Santa Cruz'},
  {label: 'Santa Fe', value: 'Santa Fe'},
  {label: 'Santiago del Estero', value: 'Santiago del Estero'},
  {label: 'Tierra del Fuego', value: 'Tierra del Fuego'},
  {label: 'Tucumán', value: 'Tucumán'},
]
