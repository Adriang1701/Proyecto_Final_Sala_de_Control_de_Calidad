// Datos ficticios para la simulación académica: ningún estudiante, expediente ni pago es real.
export const ALUMNO_DEMO = {
  id: 'A01',
  nombre: 'Valeria Hernández',
  expediente: '000001',
  carrera: 'Ingeniería de Software',
  periodo: '2027-1',
  aprobadas: ['Cálculo I', 'Programación I'],
}

const g = (id, materia, requiere, dias, ini, fin, inscritos) =>
  ({ id, materia, requiere, horario: { dias, ini, fin }, inscritos, cupo: 35 })

export const GRUPOS = [
  g('CALC2-01', 'Cálculo II', 'Cálculo I', ['Ma', 'Ju'], 8, 10, 20),
  g('PROG2-01', 'Programación II', 'Programación I', ['Lu', 'Mi'], 10, 12, 34),
  g('FIS2-01', 'Física II', 'Física I', ['Lu', 'Mi'], 8, 10, 10),
  g('BD-01', 'Bases de Datos', null, ['Ma', 'Ju'], 8, 10, 15),
  g('REDES-01', 'Redes', null, ['Vi'], 8, 11, 35),
  g('ETI-02', 'Ética Profesional', null, ['Vi'], 12, 14, 5),
  g('EST-01', 'Estadística', null, ['Lu', 'Mi'], 12, 14, 22),
  g('ING-01', 'Inglés IV', null, ['Ma', 'Ju'], 12, 14, 18),
  g('SO-01', 'Sistemas Operativos', null, ['Lu', 'Mi'], 16, 18, 30),
  g('IA-01', 'Introducción a la IA', null, ['Ma', 'Ju'], 16, 18, 12),
  g('WEB-01', 'Desarrollo Web', null, ['Vi'], 16, 18, 9),
]
