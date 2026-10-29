const RESPUESTAS = [['aprobado', 'Aprobado'], ['rechazado', 'Tarjeta rechazada'], ['sin_conexion', 'Sin conexión']]

const ESCENARIOS = [
  ['D01', 'Sobrecupo', 'Agrega Programación II (34/35) en la app, pulsa “+1” aquí y luego “Validar y reservar”: se rechaza y el grupo se queda en 35.'],
  ['D02/D03', 'Reglas combinadas', 'Agrega Física II, Redes, Cálculo II y Bases de Datos: aparecen todos los motivos y ningún cupo cambia.'],
  ['D04', 'Pago tardío', 'Reserva, cancela y pulsa “Enviar pago tardío”: sigue Cancelada y el pago pasa a revisión.'],
  ['D05/D10', 'Límite de materias', 'La séptima materia entra; la octava se rechaza y el total queda en 7.'],
  ['D06', 'Móvil 390×844', 'Abre la app con el viewport del navegador en 390×844: acciones visibles sin scroll horizontal.'],
  ['D07', 'Corte de red', 'Elige “Sin conexión” y paga: los lugares siguen reservados y se puede reintentar.'],
  ['D08', 'Privacidad', 'Cierra sesión en la app: no queda ningún dato del alumno en pantalla.'],
  ['D09', 'Doble clic / duplicado', 'El botón de pago se bloquea al procesar; “Reenviar última notificación” no duplica el comprobante.'],
  ['M01', 'Sesión vencida', 'Con materias en Borrador pulsa “Vencer sesión” y vuelve a entrar: el borrador se recupera.'],
]

export default function Tablero({ s, enviar, respuestaPasarela, setRespuestaPasarela }) {
  const excedidos = s.grupos.filter((g) => g.inscritos > g.cupo)
  return (
    <div className="pagina tablero">
      <header className="cabecera">
        <div className="marca"><span className="logo-u">U</span> Tablero de pruebas <span className="chip chip-alerta">Simulación académica · Equipo 2</span></div>
        <a className="boton-enlace" href="#/">Ir a la aplicación →</a>
      </header>

      <section className="kpis">
        <div className="kpi"><small>Solicitud</small><strong>{s.estado}</strong></div>
        <div className="kpi"><small>Sesión</small><strong>{s.alumno ? `Exp. ${s.alumno.expediente}` : 'Sin sesión'}</strong></div>
        <div className="kpi"><small>Pagos confirmados</small><strong>{s.pagos.length}</strong></div>
        <div className="kpi"><small>Pagos en revisión</small><strong>{s.revision.length}</strong></div>
        <div className={`kpi ${excedidos.length ? 'kpi-mal' : 'kpi-bien'}`}><small>Integridad de cupo</small>
          <strong>{excedidos.length ? `${excedidos.length} grupo(s) excedido(s)` : '✓ Ningún grupo excede 35'}</strong></div>
      </section>

      <div className="rejilla">
        <section className="tarjeta">
          <h2>Grupos y cupos</h2>
          <table className="tabla">
            <thead><tr><th>Grupo</th><th>Materia</th><th>Ocupación</th><th><span className="sr">Acción</span></th></tr></thead>
            <tbody>
              {s.grupos.map((g) => (
                <tr key={g.id} className={s.tira.includes(g.id) ? 'resaltada' : ''}>
                  <td className="clave">{g.id}</td>
                  <td>{g.materia}</td>
                  <td>{g.inscritos}/{g.cupo}</td>
                  <td><button className="secundario chico" title="Otro estudiante intenta tomar un lugar" onClick={() => enviar({ tipo: 'otroEstudiante', id: g.id })}>+1 otro estudiante</button></td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="nota">Las filas resaltadas están en la selección del alumno.</p>
        </section>

        <aside className="lateral">
          <section className="tarjeta">
            <h2>Pasarela de pago</h2>
            <fieldset className="opciones">
              <legend>Respuesta al pulsar “Pagar inscripción”</legend>
              {RESPUESTAS.map(([v, t]) => (
                <label key={v} className={respuestaPasarela === v ? 'activa' : ''}>
                  <input type="radio" name="pasarela" value={v} checked={respuestaPasarela === v} onChange={() => setRespuestaPasarela(v)} /> {t}
                </label>
              ))}
            </fieldset>
            <div className="acciones">
              <button className="secundario" disabled={s.estado !== 'Confirmada'} onClick={() => enviar({ tipo: 'pago', id: s.pagos.at(-1), resultado: 'aprobado' })}>Reenviar última notificación</button>
              <button className="secundario" disabled={s.estado !== 'Cancelada'} onClick={() => enviar({ tipo: 'pago', id: `P-${Date.now()}`, resultado: 'aprobado' })}>Enviar pago tardío</button>
            </div>
          </section>

          <section className="tarjeta">
            <h2>Sesión</h2>
            <button className="secundario" disabled={!s.alumno} onClick={() => enviar({ tipo: 'salir', vencida: true })}>Vencer sesión</button>
          </section>

          <section className="tarjeta">
            <h2>Bitácora <small>({s.bitacora.length})</small></h2>
            {!s.bitacora.length && <p className="vacio">Sin eventos todavía.</p>}
            <ol className="bitacora">{s.bitacora.map((b, i) => <li key={i}><span className="chip">{b.estado}</span> {b.texto}</li>)}</ol>
          </section>
        </aside>
      </div>

      <section className="tarjeta">
        <h2>Guía de verificación de defectos</h2>
        <table className="tabla">
          <thead><tr><th>ID</th><th>Escenario</th><th>Cómo comprobarlo</th></tr></thead>
          <tbody>{ESCENARIOS.map(([id, t, c]) => <tr key={id}><td className="clave">{id}</td><td>{t}</td><td>{c}</td></tr>)}</tbody>
        </table>
      </section>
    </div>
  )
}
