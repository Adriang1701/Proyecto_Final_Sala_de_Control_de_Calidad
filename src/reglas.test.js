// Ejecutar: npm test  (usa el runner integrado de Node, sin dependencias)
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { reducir, estadoInicial } from './reglas.js'
import { ALUMNO_DEMO, GRUPOS } from './datos.js'

const run = (s, ...acciones) => acciones.reduce(reducir, s)
const entrar = () => reducir(estadoInicial(GRUPOS), { tipo: 'entrar', alumno: ALUMNO_DEMO })
const agregar = (...ids) => ids.map((id) => ({ tipo: 'agregar', id }))
const cupo = (s, id) => s.grupos.find((g) => g.id === id).inscritos

test('D1: todas las condiciones en Sí reserva y descuenta cupo', () => {
  const s = run(entrar(), ...agregar('CALC2-01'), { tipo: 'reservar' })
  assert.equal(s.estado, 'Pendiente de pago')
  assert.equal(cupo(s, 'CALC2-01'), 21)
})

test('D6/D8: varias fallas se reportan todas y no se toca ningún cupo (D02, D03)', () => {
  // FIS2-01 sin prerrequisito, REDES-01 lleno, CALC2-01 y BD-01 se empalman (Ma-Ju 8-10)
  const s = run(entrar(), ...agregar('FIS2-01', 'REDES-01', 'CALC2-01', 'BD-01'), { tipo: 'reservar' })
  assert.equal(s.estado, 'Borrador')
  assert.match(s.rechazos['FIS2-01'][0], /Prerrequisito/)
  assert.deepEqual(s.rechazos['REDES-01'], ['Grupo sin cupo disponible'])
  assert.match(s.rechazos['CALC2-01'][0], /Conflicto de horario/)
  for (const g of GRUPOS) assert.equal(cupo(s, g.id), g.inscritos)
})

test('Límite de materias: la séptima entra y la octava no (D05, D10)', () => {
  const siete = ['CALC2-01', 'PROG2-01', 'ETI-02', 'EST-01', 'ING-01', 'SO-01', 'IA-01']
  const s = run(entrar(), ...agregar(...siete, 'WEB-01'))
  assert.equal(s.tira.length, 7)
  assert.equal(s.aviso.tipo, 'error')
  assert.equal(run(s, { tipo: 'reservar' }).estado, 'Pendiente de pago')
})

test('Último lugar: si otro estudiante lo toma primero, nunca hay sobrecupo (D01)', () => {
  const s = run(entrar(), ...agregar('PROG2-01'), { tipo: 'otroEstudiante', id: 'PROG2-01' }, { tipo: 'reservar' }, { tipo: 'otroEstudiante', id: 'PROG2-01' })
  assert.equal(s.estado, 'Borrador')
  assert.equal(cupo(s, 'PROG2-01'), 35)
})

test('Pago rechazado libera, reintento reserva, pago duplicado es idempotente', () => {
  let s = run(entrar(), ...agregar('PROG2-01'), { tipo: 'reservar' })
  assert.equal(cupo(s, 'PROG2-01'), 35)
  s = run(s, { tipo: 'pago', id: 'P-0001', resultado: 'rechazado' })
  assert.equal(s.estado, 'Borrador')
  assert.equal(cupo(s, 'PROG2-01'), 34)
  s = run(s, { tipo: 'reservar' }, { tipo: 'pago', id: 'P-0002', resultado: 'aprobado' }, { tipo: 'pago', id: 'P-0002', resultado: 'aprobado' })
  assert.equal(s.estado, 'Confirmada')
  assert.deepEqual(s.pagos, ['P-0002'])
  assert.equal(cupo(s, 'PROG2-01'), 35)
})

test('Sin conexión no cambia nada; pago tardío no reactiva una cancelada (D04)', () => {
  let s = run(entrar(), ...agregar('CALC2-01'), { tipo: 'reservar' }, { tipo: 'pago', id: 'P-1', resultado: 'sin_conexion' })
  assert.equal(s.estado, 'Pendiente de pago')
  s = run(s, { tipo: 'cancelar' }, { tipo: 'pago', id: 'P-2', resultado: 'aprobado' })
  assert.equal(s.estado, 'Cancelada')
  assert.equal(s.folio, null)
  assert.deepEqual(s.revision, ['P-2'])
  assert.equal(cupo(s, 'CALC2-01'), 20)
})

test('Transiciones no permitidas: pagar desde Borrador y cancelar una Confirmada', () => {
  let s = run(entrar(), ...agregar('CALC2-01'), { tipo: 'pago', id: 'P-1', resultado: 'aprobado' })
  assert.equal(s.estado, 'Borrador')
  s = run(s, { tipo: 'reservar' }, { tipo: 'pago', id: 'P-1', resultado: 'aprobado' }, { tipo: 'cancelar' })
  assert.equal(s.estado, 'Confirmada')
})

test('Al salir no queda ningún dato del estudiante (D08)', () => {
  const s = run(entrar(), ...agregar('CALC2-01'), { tipo: 'salir' })
  assert.equal(s.alumno, null)
  assert.deepEqual(s.tira, [])
})
