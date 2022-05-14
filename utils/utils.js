export function range(size) {
  return [...Array(size).keys()];
}

export function momentToMarkedDate(moment) {
  return {
    date: moment,
    dots: [{
      color: '#07ACB9',
      selectedColor: 'white',
    }],
  };
}
