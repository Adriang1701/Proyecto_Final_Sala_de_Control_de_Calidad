"""Prototipo controlado de la regla de reserva de InscribeUAQ (simulacion academica, Equipo 2).

Modela C1 prerrequisito, C2 cupo, C3 choque de horario y RN3 (maximo 7 materias).
`atomico=False` reproduce el comportamiento de la version 0.6 (leer-y-luego-escribir sin bloqueo)
para poder demostrar el defecto DEF-02 de forma controlada.
"""
import threading
import time

CUPO_MAXIMO = 35
MAX_MATERIAS = 7


class Grupo:
    def __init__(self, clave, inscritos=0, horario=("Ma-Ju", 8, 10), cupo=CUPO_MAXIMO):
        self.clave, self.inscritos, self.horario, self.cupo = clave, inscritos, horario, cupo
        self._lock = threading.Lock()

    @property
    def disponibles(self):
        return self.cupo - self.inscritos


def _choca(h1, h2):
    return h1[0] == h2[0] and h1[1] < h2[2] and h2[1] < h1[2]


def validar_y_reservar(alumno, grupo, atomico=True):
    """Devuelve (estado, motivos). Solo con C1, C2, C3 y RN3 en 'Si' pasa a 'Pendiente de pago'."""
    def evaluar():
        motivos = []
        if not alumno["prerrequisito_aprobado"]:
            motivos.append("Prerrequisito no aprobado")
        if grupo.disponibles <= 0:
            motivos.append("Grupo sin cupo disponible")
        if any(_choca(grupo.horario, h) for h in alumno["horarios"]):
            motivos.append("Conflicto de horario")
        if len(alumno["horarios"]) >= MAX_MATERIAS:
            motivos.append("Limite de 7 materias alcanzado")
        return motivos

    if atomico:
        with grupo._lock:
            motivos = evaluar()
            if not motivos:
                grupo.inscritos += 1
    else:
        motivos = evaluar()
        time.sleep(0.001)  # ventana entre validar y escribir, como en la v0.6
        if not motivos:
            grupo.inscritos += 1
    return ("Borrador", motivos) if motivos else ("Pendiente de pago", [])
