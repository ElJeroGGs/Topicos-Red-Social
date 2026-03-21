import random
from datetime import datetime

TOTAL_USUARIOS = 2_000_000
TOTAL_COMENTARIOS = 2_000_000
PORCENTAJE = 0.7

usuarios = list(range(TOTAL_USUARIOS))
random.shuffle(usuarios)

usuarios_activos = usuarios[:int(TOTAL_USUARIOS * PORCENTAJE)]

fecha_inicio = datetime(2020, 1, 1)
fecha_fin = datetime(2026, 1, 1)

BASE_TS = int(fecha_inicio.timestamp())
RANGO_TS = int((fecha_fin - fecha_inicio).total_seconds())


def random_fecha():
    r = random.random() ** 2
    return datetime.fromtimestamp(
        BASE_TS + int(r * RANGO_TS)
    ).isoformat()


def reacciones_count():
    r = random.random()
    if r < 0.5:
        return random.randint(3, 5)
    elif r < 0.85:
        return random.randint(5, 7)
    else:
        return random.randint(7, 10)


def generar_reacciones():
    for user in usuarios_activos:
        cantidad = reacciones_count()

        comentarios = set()
        while len(comentarios) < cantidad:
            comentario = random.randint(0, TOTAL_COMENTARIOS - 1)
            comentarios.add(comentario)

        for comentario in comentarios:
            yield {
                ":START_ID(Usuario)": user,
                ":END_ID(Comentario)": comentario,
                "fecha_relacion": random_fecha()
            }