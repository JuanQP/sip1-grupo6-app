export function bordeSegunEstado(estado) {
  switch (estado.toLowerCase()) {
    case 'completada':
      return 'solid';
    case 'pendiente':
      return 'dashed';
    case 'pospuesta':
      return 'dotted';
    default:
      break;
  }
}
