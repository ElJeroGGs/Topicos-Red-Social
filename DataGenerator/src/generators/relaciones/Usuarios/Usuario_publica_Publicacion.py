import random
from datetime import datetime

TOTAL_USUARIOS = 2_000_000
TOTAL_PUBLICACIONES = 2_000_000
PORCENTAJE_USUARIOS_ACTIVOS = 0.7  # usuarios que hacen publicaciones

usuarios = list(range(TOTAL_USUARIOS))
random.shuffle(usuarios)

usuarios_activos = usuarios[:int(TOTAL_USUARIOS * PORCENTAJE_USUARIOS_ACTIVOS)]

fecha_inicio = datetime(2020, 1, 1)
fecha_fin = datetime(2026, 1, 1)

BASE_TS = int(fecha_inicio.timestamp())
RANGO_TS = int((fecha_fin - fecha_inicio).total_seconds())


def random_fecha():
    r = random.random() ** 2  # sesgo hacia fechas recientes
    return datetime.fromtimestamp(
        BASE_TS + int(r * RANGO_TS)
    ).isoformat()


def generar_publica():
    for publicacion_id in range(TOTAL_PUBLICACIONES):
        # Elegir usuario aleatorio de los activos
        user = random.choice(usuarios_activos)

        yield {
            ":START_ID(Usuario)": user,
            ":END_ID(Publicacion)": publicacion_id,
            "fecha_relacion": random_fecha()
        }