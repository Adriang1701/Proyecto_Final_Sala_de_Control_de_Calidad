# InscribeUAQ (Equipo 2)

Aplicación en React de la versión propuesta de InscribeUAQ, con los defectos del expediente corregidos. Datos ficticios; sin pagos reales.

**En línea:** https://proyectofinalsaladecontroldecalidad.vercel.app/ · Tablero de pruebas: https://proyectofinalsaladecontroldecalidad.vercel.app/#/tablero

**Entregables** (expediente, presentación y guía de exposición): carpeta [`Entregables/`](Entregables/).

## Ejecutar

```bash
npm install
npm run dev     # http://localhost:5173
npm test        # 8 pruebas de las reglas (node --test)
```

## Dos vistas

- **Aplicación del alumno** — `http://localhost:5173/`: inicio de sesión con expediente de 6 dígitos (cualquier contraseña), oferta con cupos, selección con horario semanal, reserva, pago y descarga del horario.
- **Tablero de pruebas** — `http://localhost:5173/#/tablero`: todo lo de simulación. Ocupa lugares como "otro estudiante", elige la respuesta de la pasarela (aprobado, rechazado, sin conexión), reenvía notificaciones, envía pagos tardíos, vence la sesión, muestra cupos, integridad y bitácora, e incluye la guía para verificar cada defecto (D01–D10, M01).

Ambas vistas comparten la misma sesión dentro de la misma pestaña: cambia entre ellas con la dirección o con el enlace "Ir a la aplicación".

La lógica está en `src/reglas.js` (función pura `reducir`) y sus pruebas en `src/reglas.test.js`.
