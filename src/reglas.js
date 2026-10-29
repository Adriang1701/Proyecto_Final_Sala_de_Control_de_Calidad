// Reglas de InscribeUAQ (versión propuesta). Cada bloque indica el defecto del expediente que corrige.
export const MAX_MATERIAS = 7

export const choca = (a, b) => a.dias.some((d) => b.dias.includes(d)) && a.ini < b.fin && b.ini < a.fin

// Todos los motivos de rechazo de un grupo (D02, D03: se evalúan todas las condiciones, no sólo la primera).
export function motivos(alumno, grupo, tira) {
  const m = []
  if (grupo.requiere && !alumno.aprobadas.includes(grupo.requiere)) m.push(`Prerrequisito no aprobado: ${grupo.requiere}`)
  if (grupo.inscritos >= grupo.cupo) m.push('Grupo sin cupo disponible')
  const otro = tira.find((t) => t.id !== grupo.id && choca(t.horario, grupo.horario))
  if (otro) m.push(`Conflicto de horario con ${otro.materia}`)
  return m
}

export const estadoInicial = (grupos) => ({
  alumno: null, grupos, tira: [], estado: 'Borrador', folio: null, pagos: [], revision: [], rechazos: {}, aviso: null, bitacora: [],
})

// registrar: sólo bitácora (eventos de backend que el alumno no ve); avisar: además lo muestra al alumno.
const registrar = (s, texto) => ({ ...s, bitacora: [{ texto, estado: s.estado }, ...s.bitacora].slice(0, 30) })
const avisar = (s, tipo, texto) => ({ ...registrar(s, texto), aviso: { tipo, texto } })
const ajustarCupo = (grupos, ids, delta) => grupos.map((g) => (ids.includes(g.id) ? { ...g, inscritos: g.inscritos + delta } : g))
const grupoDe = (s, id) => s.grupos.find((g) => g.id === id)

export function reducir(s, a) {
  switch (a.tipo) {
    case 'entrar': {
      const tira = (a.borrador ?? []).filter((id) => grupoDe(s, id))
      const r = { ...s, alumno: a.alumno, tira, estado: 'Borrador', folio: null, rechazos: {} }
      return tira.length ? avisar(r, 'info', `Recuperamos tu borrador con ${tira.length} materia(s).`) : { ...r, aviso: null }
    }
    case 'salir':
      // Al salir no queda ningún dato del estudiante en pantalla (D08).
      return { ...estadoInicial(s.grupos), aviso: a.vencida ? { tipo: 'alerta', texto: 'Tu sesión venció. Tu borrador quedó guardado; vuelve a entrar para continuar.' } : null }

    case 'agregar': {
      if (s.estado !== 'Borrador') return avisar(s, 'alerta', 'Sólo puedes modificar la selección en Borrador.')
      if (s.tira.includes(a.id)) return s
      // RN3: la séptima se acepta, la octava se rechaza y el total queda en 7 (D05 y D10).
      if (s.tira.length >= MAX_MATERIAS) return avisar(s, 'error', `Límite de ${MAX_MATERIAS} materias alcanzado. Tu selección sigue con ${MAX_MATERIAS}.`)
      return { ...s, tira: [...s.tira, a.id], aviso: null }
    }
    case 'quitar':
      if (s.estado !== 'Borrador') return avisar(s, 'alerta', 'Sólo puedes modificar la selección en Borrador.')
      return { ...s, tira: s.tira.filter((id) => id !== a.id), rechazos: { ...s.rechazos, [a.id]: undefined } }

    case 'reservar': {
      if (s.estado !== 'Borrador') return avisar(s, 'error', 'La solicitud no está en Borrador.')
      if (!s.tira.length) return avisar(s, 'alerta', 'Agrega al menos una materia.')
      const tira = s.tira.map((id) => grupoDe(s, id))
      const rechazos = Object.fromEntries(tira.map((g) => [g.id, motivos(s.alumno, g, tira)]).filter(([, m]) => m.length))
      // Todo o nada en un solo paso: si algo falla no se reserva ningún lugar (D01, D03).
      if (Object.keys(rechazos).length) return avisar({ ...s, rechazos }, 'error', 'No se reservó ningún lugar. Revisa los motivos marcados.')
      return avisar({ ...s, grupos: ajustarCupo(s.grupos, s.tira, +1), estado: 'Pendiente de pago', rechazos: {} }, 'ok',
        'Lugares reservados. Completa el pago para confirmar tu inscripción.')
    }

    case 'pago': {
      const { id, resultado } = a
      if (s.estado === 'Confirmada' && s.pagos.includes(id)) return registrar(s, `Notificación repetida del pago ${id}: se conserva el comprobante ${s.folio}, sin duplicados.`)
      // Un pago sobre una solicitud cancelada nunca la reactiva (D04).
      if (s.estado === 'Cancelada') return registrar({ ...s, revision: [...s.revision, id] }, `Pago ${id} recibido sobre una solicitud cancelada: queda registrado para revisión y reembolso. La solicitud sigue Cancelada.`)
      if (s.estado !== 'Pendiente de pago') return avisar(s, 'error', 'No existe una reserva activa para procesar un pago.')
      if (resultado === 'sin_conexion') return avisar(s, 'alerta', 'No pudimos contactar al servicio de pago. Tus lugares siguen reservados (Pendiente de pago); puedes reintentar.')
      if (resultado === 'rechazado') return avisar({ ...s, grupos: ajustarCupo(s.grupos, s.tira, -1), estado: 'Borrador' }, 'error',
        'Pago rechazado. Liberamos tus lugares y tu selección regresó a Borrador para que reintentes.')
      return avisar({ ...s, estado: 'Confirmada', pagos: [...s.pagos, id], folio: `F-${id.slice(-4)}` }, 'ok', `Inscripción confirmada. Comprobante F-${id.slice(-4)}.`)
    }

    case 'cancelar':
      if (s.estado === 'Pendiente de pago') return avisar({ ...s, grupos: ajustarCupo(s.grupos, s.tira, -1), estado: 'Cancelada' }, 'info', 'Solicitud cancelada; tus lugares se liberaron.')
      if (s.estado === 'Borrador') return avisar({ ...s, estado: 'Cancelada' }, 'info', 'Solicitud cancelada.')
      return avisar(s, 'error', 'Una inscripción confirmada no puede cancelarse en este flujo.')

    case 'nueva':
      return { ...s, tira: [], estado: 'Borrador', folio: null, rechazos: {}, aviso: null }

    case 'otroEstudiante': {
      // Otro estudiante compite por el mismo grupo; el cupo nunca supera el máximo (D01).
      const g = grupoDe(s, a.id)
      if (g.inscritos >= g.cupo) return registrar(s, `Otro estudiante intentó entrar a ${g.materia}: rechazado, grupo lleno (${g.inscritos}/${g.cupo}).`)
      return registrar({ ...s, grupos: ajustarCupo(s.grupos, [a.id], +1) }, `Otro estudiante tomó un lugar en ${g.materia} (${g.inscritos + 1}/${g.cupo}).`)
    }
    default:
      return s
  }
}
