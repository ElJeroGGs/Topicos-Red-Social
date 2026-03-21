import random
from datetime import datetime, timedelta
from generators.Base_data import Data

data = Data()
TOTAL_USUARIOS = data.TOTAL_USUARIOS
PORCENTAJE = 0.3

usuarios = list(range(TOTAL_USUARIOS))
random.shuffle(usuarios)

usuarios_activos = usuarios[:int(TOTAL_USUARIOS * PORCENTAJE)]

fecha_inicio = datetime(2020, 1, 1)
fecha_fin = datetime(2026, 1, 1)
delta = (fecha_fin - fecha_inicio).total_seconds()

BASE_TS = int(fecha_inicio.timestamp())
RANGO_TS = int(delta)


def random_fecha():
    # Sesgo hacia fechas recientes
    r = random.random() ** 2
    return datetime.fromtimestamp(
        BASE_TS + int(r * RANGO_TS)
    ).isoformat()


def bloqueos_count():
    r = random.random()
    if r < 0.7:
        return 1
    elif r < 0.95:
        return 2
    else:
        return random.randint(3, 5)


def generar_bloqueos():
    for user in usuarios_activos:
        cantidad = bloqueos_count()

        bloqueados = set()
        while len(bloqueados) < cantidad:
            candidato = random.randint(0, TOTAL_USUARIOS - 1)

            if candidato != user:
                bloqueados.add(candidato)

        for bloqueado in bloqueados:
            yield {
                ":START_ID(Usuario)": user,
                ":END_ID(Usuario)": bloqueado,
                "fecha_relacion": random_fecha()
            }