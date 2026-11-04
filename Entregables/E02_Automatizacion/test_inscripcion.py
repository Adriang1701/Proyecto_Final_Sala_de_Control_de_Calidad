"""Suite automatizada E02 (AUT-01..AUT-03). Ejecutar: python -m unittest -v test_inscripcion"""
import threading
import unittest

from inscripcion import Grupo, validar_y_reservar

LIBRE = ("Lu-Mi", 8, 10)
CHOCA = ("Ma-Ju", 8, 10)


def alumno(prerreq=True, choque=False, materias=2):
    horarios = [CHOCA if choque else LIBRE] + [("Vi", 7 + i, 8 + i) for i in range(materias - 1)]
    return {"prerrequisito_aprobado": prerreq, "horarios": horarios}


class AUT01TablaDecision(unittest.TestCase):
    """C4 del backlog (Act. 10): combinaciones D1-D8 de la Act. 7."""

    def test_d1_a_d8(self):
        tabla = [  # (id, C1 prerreq, C2 cupo, C3 sin choque)
            ("D1", True, True, True), ("D2", True, True, False), ("D3", True, False, True),
            ("D4", True, False, False), ("D5", False, True, True), ("D6", False, True, False),
            ("D7", False, False, True), ("D8", False, False, False),
        ]
        for did, c1, c2, c3 in tabla:
            with self.subTest(did):
                g = Grupo("CALC2-01", inscritos=20 if c2 else 35)
                antes = g.inscritos
                estado, motivos = validar_y_reservar(alumno(prerreq=c1, choque=not c3), g)
                if c1 and c2 and c3:
                    self.assertEqual(estado, "Pendiente de pago")
                    self.assertEqual(g.inscritos, antes + 1)
                else:
                    self.assertEqual(estado, "Borrador")
                    self.assertEqual(g.inscritos, antes, "un rechazo no debe tocar el cupo")
                    self.assertEqual(len(motivos), [c1, c2, c3].count(False), "deben mostrarse todos los motivos")


class AUT02Limites(unittest.TestCase):
    """Valores limite de cupo (34/35) y de materias (6->7 permitido, 7->8 rechazado; DEF-03/DEF-04)."""

    def test_cupo_34_acepta_ultimo_lugar(self):
        g = Grupo("FIS-01", inscritos=34)
        self.assertEqual(validar_y_reservar(alumno(), g)[0], "Pendiente de pago")
        self.assertEqual(g.inscritos, 35)

    def test_cupo_35_rechaza(self):
        g = Grupo("FIS-01", inscritos=35)
        self.assertEqual(validar_y_reservar(alumno(), g), ("Borrador", ["Grupo sin cupo disponible"]))

    def test_sexta_a_septima_materia_permitida(self):
        self.assertEqual(validar_y_reservar(alumno(materias=6), Grupo("ETI-02", 10))[0], "Pendiente de pago")

    def test_septima_a_octava_rechazada(self):
        self.assertEqual(validar_y_reservar(alumno(materias=7), Grupo("ETI-02", 10))[0], "Borrador")


def _rafaga(atomico, solicitudes=20):
    g = Grupo("BD-01", inscritos=34)
    barrera = threading.Barrier(solicitudes)
    exitos = []

    def intento():
        barrera.wait()
        if validar_y_reservar(alumno(), g, atomico=atomico)[0] == "Pendiente de pago":
            exitos.append(1)

    hilos = [threading.Thread(target=intento) for _ in range(solicitudes)]
    for h in hilos:
        h.start()
    for h in hilos:
        h.join()
    return g.inscritos, len(exitos)


class AUT03Concurrencia(unittest.TestCase):
    """Invariante del riesgo R01: nunca mas de 35 inscritos ni mas de un exito por el ultimo lugar."""

    def test_ultimo_cupo_con_reserva_atomica(self):
        for _ in range(30):
            self.assertEqual(_rafaga(atomico=True), (35, 1))

    @unittest.expectedFailure
    def test_ultimo_cupo_v06_sin_bloqueo(self):
        # Reproduce DEF-02: se espera que falle mientras la confirmacion no sea atomica.
        for _ in range(30):
            self.assertEqual(_rafaga(atomico=False), (35, 1))


if __name__ == "__main__":
    unittest.main(verbosity=2)
