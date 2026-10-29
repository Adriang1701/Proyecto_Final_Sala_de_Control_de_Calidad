import { useState } from 'react'
import { motivos, MAX_MATERIAS } from './reglas.js'
import { ALUMNO_DEMO } from './datos.js'
import { leerBorrador, guardarBorrador } from './borrador.js'

const DIAS = { Lu: 'Lunes', Ma: 'Martes', Mi: 'Miércoles', Ju: 'Jueves', Vi: 'Viernes' }
const H0 = 7, H1 = 20
const hh = (h) => `${String(h).padStart(2, '0')}:00`
export const horario = (h) => `${h.dias.join(' · ')}  ${hh(h.ini)}–${hh(h.fin)}`
const tono = (id) => [...id].reduce((a, c) => a + c.charCodeAt(0), 0) % 6
const PASOS = ['Selección', 'Reserva', 'Pago', 'Confirmación']

export default function Alumno({ s, enviar, pagar, procesando }) {
  const [filtro, setFiltro] = useState('')
  if (!s.alumno) return <Entrada aviso={s.aviso} onEntrar={(expediente) => enviar({ tipo: 'entrar', alumno: { ...ALUMNO_DEMO, expediente }, borrador: leerBorrador() })} />

  const tira = s.tira.map((id) => s.grupos.find((g) => g.id === id))
  const enBorrador = s.estado === 'Borrador'
  const motivosDe = (g) => s.rechazos[g.id] ?? (enBorrador ? motivos(s.alumno, g, tira) : [])
  const visibles = s.grupos.filter((g) => `${g.materia} ${g.id}`.toLowerCase().includes(filtro.toLowerCase()))
  const paso = { Confirmada: 3, 'Pendiente de pago': 2 }[s.estado] ?? (tira.length ? 1 : 0)
  const iniciales = s.alumno.nombre.split(' ').map((p) => p[0]).join('').slice(0, 2)

  const descargar = () => {
    const filas = [['Materia', 'Grupo', 'Horario'], ...tira.map((g) => [g.materia, g.id, horario(g.horario)])]
    const url = URL.createObjectURL(new Blob(['﻿' + filas.map((f) => f.join(',')).join('\n')], { type: 'text/csv' }))
    Object.assign(document.createElement('a'), { href: url, download: `horario_${s.folio}.csv` }).click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="pagina">
      <header className="cabecera">
        <div className="marca"><span className="logo-u">U</span> InscribeUAQ <span className="chip">Periodo {s.alumno.periodo}</span></div>
        <div className="usuario">
          <span className="avatar" aria-hidden="true">{iniciales}</span>
          <span><strong>{s.alumno.nombre}</strong><small>{s.alumno.carrera} · Exp. {s.alumno.expediente}</small></span>
          <button className="fantasma" onClick={() => { guardarBorrador([]); enviar({ tipo: 'salir' }) }}>Cerrar sesión</button>
        </div>
      </header>

      <ol className="pasos" aria-label="Avance de tu inscripción">
        {PASOS.map((p, i) => <li key={p} className={i < paso ? 'hecho' : i === paso ? 'actual' : ''} aria-current={i === paso ? 'step' : undefined}><span>{i < paso ? '✓' : i + 1}</span>{p}</li>)}
      </ol>

      {s.aviso && <div className={`aviso aviso-${s.aviso.tipo}`} role="status" aria-live="polite">{s.aviso.texto}</div>}

      <main className="rejilla">
        <section className="tarjeta" aria-labelledby="t-oferta">
          <div className="titulo-seccion">
            <h2 id="t-oferta">Oferta académica</h2>
            <input className="buscador" type="search" value={filtro} onChange={(e) => setFiltro(e.target.value)} placeholder="Buscar materia o grupo" aria-label="Buscar materia o grupo" />
          </div>
          <ul className="oferta">
            {visibles.map((g) => {
              const libres = g.cupo - g.inscritos
              const elegida = s.tira.includes(g.id)
              return (
                <li key={g.id} className={`grupo tono-${tono(g.id)}${elegida ? ' elegida' : ''}`}>
                  <div className="grupo-info">
                    <h3>{g.materia}</h3>
                    <p className="meta"><span className="clave">{g.id}</span> {horario(g.horario)}</p>
                    {g.requiere && <p className="requiere">Requiere {g.requiere}</p>}
                    <div className="cupo" aria-label={`${g.inscritos} de ${g.cupo} lugares ocupados`}>
                      <div className="barra"><span style={{ width: `${(g.inscritos / g.cupo) * 100}%` }} className={libres <= 0 ? 'llena' : libres <= 3 ? 'pocos' : ''} /></div>
                      <small className={libres <= 0 ? 'txt-lleno' : libres <= 3 ? 'txt-pocos' : ''}>{libres <= 0 ? 'Sin lugares' : libres <= 3 ? `¡Últimos ${libres}!` : `${libres} lugares`}</small>
                    </div>
                  </div>
                  <button className={elegida ? 'secundario' : ''} disabled={!enBorrador || elegida} onClick={() => enviar({ tipo: 'agregar', id: g.id })}>
                    {elegida ? 'Agregada' : 'Agregar'}
                  </button>
                </li>
              )
            })}
          </ul>
        </section>

        <aside className="lateral">
          <section className="tarjeta" aria-labelledby="t-sel">
            <div className="titulo-seccion">
              <h2 id="t-sel">Tu selección</h2>
              <span className="contador">{s.tira.length}/{MAX_MATERIAS}</span>
            </div>
            {!tira.length && <p className="vacio">Aún no agregas materias. Elige grupos de la oferta académica.</p>}
            <ul className="seleccion">
              {tira.map((g) => {
                const m = motivosDe(g)
                return (
                  <li key={g.id} className={m.length ? 'con-motivos' : ''}>
                    <span className={`punto tono-${tono(g.id)}`} aria-hidden="true" />
                    <div>
                      <strong>{g.materia}</strong>
                      <small>{g.id} · {horario(g.horario)}</small>
                      {m.map((t) => <p key={t} className="motivo">{t}</p>)}
                    </div>
                    {enBorrador && <button className="icono" aria-label={`Quitar ${g.materia}`} onClick={() => enviar({ tipo: 'quitar', id: g.id })}>×</button>}
                  </li>
                )
              })}
            </ul>
            {tira.length > 0 && <Horario grupos={tira} conChoque={(g) => motivosDe(g).some((t) => t.startsWith('Conflicto'))} />}

            {s.estado === 'Confirmada' && (
              <div className="exito">
                <span className="check" aria-hidden="true">✓</span>
                <div><strong>¡Inscripción confirmada!</strong><small>Comprobante {s.folio}</small></div>
              </div>
            )}
            {s.estado === 'Cancelada' && <p className="cancelada">Cancelaste esta solicitud. Puedes iniciar una nueva cuando quieras.</p>}

            <div className="acciones">
              {enBorrador && <>
                <button disabled={!tira.length} onClick={() => enviar({ tipo: 'reservar' })}>Validar y reservar lugares</button>
                {tira.length > 0 && <button className="fantasma" onClick={() => enviar({ tipo: 'cancelar' })}>Cancelar solicitud</button>}
              </>}
              {s.estado === 'Pendiente de pago' && <>
                <button disabled={procesando} onClick={() => pagar()}>{procesando ? 'Procesando pago…' : 'Pagar inscripción'}</button>
                <button className="fantasma" disabled={procesando} onClick={() => enviar({ tipo: 'cancelar' })}>Cancelar y liberar lugares</button>
              </>}
              {s.estado === 'Confirmada' && <button onClick={descargar}>Descargar horario</button>}
              {s.estado === 'Cancelada' && <button onClick={() => enviar({ tipo: 'nueva' })}>Nueva solicitud</button>}
            </div>
          </section>
        </aside>
      </main>
    </div>
  )
}

function Horario({ grupos, conChoque }) {
  const horas = Array.from({ length: H1 - H0 }, (_, i) => H0 + i)
  return (
    <div className="horario" role="img" aria-label="Horario semanal de tu selección">
      <span />
      {Object.keys(DIAS).map((d, i) => <span key={d} className="h-dia" style={{ gridColumn: i + 2, gridRow: 1 }}>{d}</span>)}
      {horas.map((h) => <span key={h} className="h-hora" style={{ gridColumn: 1, gridRow: h - H0 + 2 }}>{hh(h)}</span>)}
      {grupos.flatMap((g) => g.horario.dias.map((d) => (
        <div key={g.id + d} className={`bloque tono-${tono(g.id)}${conChoque(g) ? ' choque' : ''}`}
          style={{ gridColumn: Object.keys(DIAS).indexOf(d) + 2, gridRow: `${g.horario.ini - H0 + 2} / ${g.horario.fin - H0 + 2}` }}>
          {g.materia}
        </div>
      )))}
    </div>
  )
}

function Entrada({ aviso, onEntrar }) {
  const [expediente, setExpediente] = useState('')
  const [clave, setClave] = useState('')
  const [error, setError] = useState('')
  const enviar = (e) => {
    e.preventDefault()
    if (!/^\d{6}$/.test(expediente)) return setError('El expediente debe tener exactamente 6 dígitos.')
    if (!clave) return setError('Escribe tu contraseña.')
    // shortcut: no hay servicio de autenticación; cualquier expediente válido entra. Conectar al SSO institucional en producción.
    onEntrar(expediente)
  }
  return (
    <div className="entrada">
      <div className="entrada-marca">
        <span className="logo-u grande">U</span>
        <h1>InscribeUAQ</h1>
        <p>Selecciona tus materias, asegura tu lugar y obtén tu horario en minutos.</p>
      </div>
      <form className="entrada-form" onSubmit={enviar} noValidate>
        <h2>Iniciar sesión</h2>
        {aviso && <div className={`aviso aviso-${aviso.tipo}`} role="status">{aviso.texto}</div>}
        <label>Expediente
          <input inputMode="numeric" autoComplete="username" maxLength={6} value={expediente} onChange={(e) => setExpediente(e.target.value.replace(/\D/g, ''))} placeholder="6 dígitos" />
        </label>
        <label>Contraseña
          <input type="password" autoComplete="current-password" value={clave} onChange={(e) => setClave(e.target.value)} />
        </label>
        {error && <p className="error" role="alert">{error}</p>}
        <button type="submit">Entrar</button>
      </form>
    </div>
  )
}
