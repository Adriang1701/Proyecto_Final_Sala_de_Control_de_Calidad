import { useEffect, useReducer, useState } from 'react'
import { reducir, estadoInicial } from './reglas.js'
import { GRUPOS } from './datos.js'
import Alumno from './Alumno.jsx'
import Tablero from './Tablero.jsx'
import { guardarBorrador } from './borrador.js'

const useRuta = () => {
  const [ruta, setRuta] = useState(location.hash)
  useEffect(() => {
    const cambiar = () => setRuta(location.hash)
    addEventListener('hashchange', cambiar)
    return () => removeEventListener('hashchange', cambiar)
  }, [])
  return ruta
}

// El estado vive aquí para que la vista del alumno y el tablero de pruebas compartan la misma sesión.
export default function App() {
  const [s, enviar] = useReducer(reducir, GRUPOS, estadoInicial)
  const [procesando, setProcesando] = useState(false)
  const [respuestaPasarela, setRespuestaPasarela] = useState('aprobado')
  const ruta = useRuta()

  // Borrador recuperable tras una sesión vencida (mejora M01); se borra al terminar la solicitud.
  useEffect(() => {
    if (!s.alumno) return
    if (s.estado === 'Borrador') guardarBorrador(s.tira)
    if (s.estado === 'Confirmada' || s.estado === 'Cancelada') guardarBorrador([])
  }, [s.alumno, s.estado, s.tira])

  // Latencia de la pasarela; mientras procesa, el botón queda deshabilitado (evita el doble clic, D09).
  const pagar = (resultado = respuestaPasarela, id = `P-${Date.now()}`) => {
    if (procesando) return
    setProcesando(true)
    setTimeout(() => { enviar({ tipo: 'pago', id, resultado }); setProcesando(false) }, 900)
  }

  const props = { s, enviar, pagar, procesando }
  return ruta === '#/tablero'
    ? <Tablero {...props} respuestaPasarela={respuestaPasarela} setRespuestaPasarela={setRespuestaPasarela} />
    : <Alumno {...props} />
}
