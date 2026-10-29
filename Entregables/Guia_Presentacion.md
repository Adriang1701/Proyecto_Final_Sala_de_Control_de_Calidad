# Guía paso a paso de la presentación · Equipo 2 · InscribeUAQ

**Duración:** 15 minutos (13 de exposición + 2 de preguntas del comité).
**Decisión que defendemos:** **No liberar** InscribeUAQ.
**Material:** presentación de 12 diapositivas (`Presentacion_InscribeUAQ_Equipo2.pptx` en esta carpeta, o el [deck en línea](https://claude.ai/artifact/8qf9CXebzke84wTD4YgyLf)), expediente (`E02_Expediente_ProyectoFinal_InscribeUAQ.docx`) y la aplicación desplegada en Vercel: **https://proyectofinalsaladecontroldecalidad.vercel.app/** (tablero de pruebas en `/#/tablero`).

> Regla de oro: la exposición defiende la decisión con evidencia; no recorre el expediente página por página. Toda cifra se dice con su fuente (E03, E7-03, AUT-03…) y su denominador ("2 de 3", "12 de 15").

---

## 1. Antes del día de la presentación

1. **Confirmar con el profesor el número de equipo.** La plantilla asigna "Plataforma universitaria de inscripciones" al Equipo 1; nosotros somos el Equipo 2. Esto define a quién auditamos en la auditoría cruzada.
2. **Completar el expediente:** fecha de entrega, enlace al expediente digital, cierre individual de cada integrante (máx. 80 palabras) y exportarlo a PDF.
3. **Validar los datos que generó la IA** (sección 12 del expediente): la escala P×I llevada de 1–3 a 1–5 y los IDs nuevos (DEF-06, D01–D10, M01, L01, FP-01). Cada integrante revisa los de su rol contra los PDFs de las actividades 4–11.
4. **Descargar la presentación** como PPTX y PDF (respaldo sin internet).
5. **Ensayo cronometrado completo** al menos una vez; cada quien dice sólo su bloque, con la tabla de tiempos de la sección 3.
6. **Preparar la demo** (opcional, sólo para preguntas): abrir https://proyectofinalsaladecontroldecalidad.vercel.app/ y, en la misma pestaña, cambiar a `/#/tablero` cuando haga falta (el estado sólo se comparte dentro de la misma pestaña).

## 2. Montaje en el aula (5 minutos antes)

1. Abrir la presentación en modo presentador; comprobar que se lee desde el fondo del aula.
2. Tener el PDF de respaldo en una memoria USB.
3. Si habrá demo: abrir https://proyectofinalsaladecontroldecalidad.vercel.app/ e iniciar sesión con expediente `000001` y cualquier contraseña.
4. Tener a la mano el expediente impreso o abierto en la sección 9 (defectos) y 13 (tablero) para responder.

## 3. Guion por bloque

| Bloque | Tiempo | Diapositivas | Expone |
|---|---|---|---|
| Producto, usuarios y riesgos | 2 min | 1 Portada · 2 Producto · 3 Riesgos | Alfredo, Bernardo |
| Estrategia y cobertura | 3 min | 4 Estrategia · 5 Ejecución | Gabriel |
| Evidencias y defectos | 4 min | 6 Hallazgo decisivo · 7 Defectos | Adrián |
| Automatización, IA y métricas | 2 min | 8 Automatización · 9 IA · 10 Tablero | Adrián, Alfredo |
| Dictamen de liberación | 2 min | 11 Dictamen | Alfredo |
| Preguntas del comité | 2 min | 12 Respuestas preparadas | Todos |

### Paso 1 · Portada (Alfredo, ~40 s)
Decir la decisión en el primer minuto. Guion de apertura (40 palabras):
> "Evaluamos InscribeUAQ para decidir si puede abrir inscripciones. La evidencia muestra sobrecupo, reglas académicas violadas y un flujo móvil bloqueado. Por ello recomendamos no liberar, hasta corregir seis defectos y medir la carga real."

### Paso 2 · Producto (Alfredo, ~40 s)
- 4,000 estudiantes en las primeras dos horas, mayoritariamente desde el celular.
- Falla grave = inscrito sin lugar real, pago sin inscripción, selección perdida o no poder entrar.
- Aclarar la modalidad: simulación académica + prototipo propio, sin datos reales.

### Paso 3 · Riesgos (Bernardo, ~40 s)
- 10 riesgos identificados; los 5 prioritarios suman exposición 16–20.
- Desempate: primero lo más difícil de detectar o recuperar (sobrecupo y seriación son silenciosos).

### Paso 4 · Estrategia (Gabriel, ~1 min 30 s)
- Cada técnica responde a un riesgo: valores límite, tabla de decisión D1–D8, estados T1–T5, exploratorias, concurrencia automatizada.
- Mencionar las exclusiones (pasarela real, carga real, todos los móviles) como riesgo residual, no como olvido.

### Paso 5 · Ejecución (Gabriel, ~1 min 30 s)
- 15 casos diseñados → 12 ejecutados → sólo 3 aprobados.
- Bloqueados (pagos QA y carga) no cuentan como aprobados.
- Ejemplo de por qué hace falta regresión: la corrección 0.6.1 arregló la octava materia pero rompió la séptima (D05).

### Paso 6 · Hallazgo decisivo (Adrián, ~2 min)
- **36/35** en 2 de 3 repeticiones (CP-03, E03).
- **54/35** en nuestro script sin bloqueo (10 de 10 ráfagas); con reserva atómica, 35/35 en 30 de 30.
- Frase clave: "Intermitente no significa que a veces funciona; con 4,000 usuarios sólo puede empeorar."
- Reconocer el límite: el script modela la regla, no mide la plataforma.

### Paso 7 · Defectos (Adrián, ~2 min)
- Dos críticos (D01 sobrecupo, D04 pago tardío) y cuatro altos, todos de prioridad inmediata.
- Distinguimos tipos: mejoras, limitaciones de ambiente, error de proceso y un falso positivo (el doble clic no duplicó la reserva).

### Paso 8 · Automatización (Adrián, ~40 s)
- Automatizamos primero lo que a mano no se repite con confianza (concurrencia) y las reglas combinadas.
- El pago se automatizará después con un stub; lo visual y la claridad de mensajes se quedan manuales.

### Paso 9 · IA (Alfredo, ~40 s)
- La IA consolidó el expediente y propuso el código; el equipo verificó cada dato y ejecutó el script.
- No se delega: el dictamen, la severidad ni la aceptación del riesgo.

### Paso 10 · Tablero (Adrián, ~40 s)
- Ningún indicador cumple su meta. Señalar sólo tres: 25% aprobado, 7 críticos/altos abiertos y R02 sin evidencia.

### Paso 11 · Dictamen (Alfredo, 2 min)
- **No liberar.** Por qué, acciones obligatorias y cuándo reevaluar.
- Si preguntan "¿por qué no liberar con condiciones?": el monitoreo detecta el sobrecupo después de que ocurre; no lo evita, y el daño es difícil de revertir en plena ventana.

### Paso 12 · Preguntas (todos, 2 min)
Cada quien toma las preguntas de su rol (ver sección 4).

## 4. Preguntas del comité y quién responde

| Pregunta | Responde | Respuesta corta |
|---|---|---|
| ¿Qué riesgo podría no estar cubierto? | Bernardo | R02 (saturación): CP-11 diseñado pero bloqueado. Es desconocido, no aprobado. |
| ¿Qué evidencia demuestra la conclusión? | Adrián | E03 (36/35) reproducido por AUT-03; E02 (3 de 3); E7-03; E8-06 (100%). |
| ¿Qué defecto cambiaría la decisión? | Adrián | Corregir D01 y D04 con regresión en verde permitiría pasar a "liberar con condiciones". |
| ¿Qué dependió demasiado de la IA? | Alfredo | La redacción y la consolidación; la evidencia viene de las rondas 0.6, 0.6.1, 0.7 y del script ejecutado. |
| ¿Qué prueba ejecutarían de nuevo? | Gabriel | CP-03 con más repeticiones sobre la versión corregida y CP-05 como regresión. |

**Demo opcional (si el comité la pide, ≤ 1 minuto):** en el tablero (`/#/tablero`) pulsar "+1 otro estudiante" en PROG2-01 hasta 35/35; en la app intentar reservar Programación II → se rechaza y el indicador "Integridad de cupo" sigue en verde. Muestra cómo debe comportarse la versión corregida.

## 5. Auditoría cruzada

- Según la tabla de la plantilla, el Equipo 2 **audita al Equipo 3**. Preparar dos preguntas basadas en su matriz de riesgos y su evidencia decisiva, usando las cinco preguntas del comité.
- Registrar sus respuestas en la tabla "Registro del comité auditor" de su expediente.

## 6. Lista de verificación final

- [ ] Número de equipo confirmado con el profesor.
- [ ] Expediente completo y exportado a PDF.
- [ ] Datos generados con IA validados por el equipo.
- [ ] Presentación descargada en PPTX y PDF.
- [ ] Ensayo cronometrado en 13 minutos o menos.
- [ ] Cada integrante puede explicar el dictamen y la evidencia decisiva.
- [ ] Enlace de Vercel probado desde un celular.
