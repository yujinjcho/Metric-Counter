function titleize(field) {
  return `${field[0].toUpperCase()}${field.slice(1)}`.match(/[A-Z]{1}[a-z]*/g).join(' ');
}

export {
  titleize
};
