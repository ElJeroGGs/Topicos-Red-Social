import random
from datetime import datetime, timedelta

TOTAL_USUARIOS = 1_000_000
TOTAL_COMENTARIOS = 1_000_000
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


def generar_comenta():
    for comentario_id in range(TOTAL_COMENTARIOS):
        user = random.choice(usuarios_activos)

        yield {
            ":START_ID(Usuario)": user,
            ":END_ID(Comentario)": comentario_id,
            "fecha_relacion": random_fecha()
        }