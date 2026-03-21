import random
from datetime import datetime, timedelta

TOTAL_USUARIOS = 2_000_000
PORCENTAJE = 0.7

usuarios = list(range(TOTAL_USUARIOS))
random.shuffle(usuarios)

usuarios_activos = usuarios[:int(TOTAL_USUARIOS * PORCENTAJE)]

fecha_inicio = datetime(2020, 1, 1)
fecha_fin = datetime(2026, 1, 1)
delta = (fecha_fin - fecha_inicio).total_seconds()


def random_fecha():
    segundos = random.randint(0, int(delta))
    return (fecha_inicio + timedelta(seconds=segundos)).isoformat()


def follows_count():
    r = random.random()
    if r < 0.5:
        return random.randint(2, 3)
    elif r < 0.85:
        return random.randint(3, 4)
    else:
        return random.randint(4, 6)


def generar_relaciones():
    for user in usuarios_activos:
        cantidad = follows_count()

        seguidos = set()
        while len(seguidos) < cantidad:
            candidato = random.randint(0, TOTAL_USUARIOS - 1)

            if candidato != user:
                seguidos.add(candidato)

        for seguido in seguidos:
            yield {
                ":START_ID(Usuario)": user,
                ":END_ID(Usuario)": seguido,
                "fecha_relacion": random_fecha()
            }