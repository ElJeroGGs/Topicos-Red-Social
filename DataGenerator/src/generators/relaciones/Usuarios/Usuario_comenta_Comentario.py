import random
from datetime import datetime, timedelta
from generators.Base_data import Data

data = Data()
TOTAL_USUARIOS = data.TOTAL_USUARIOS
TOTAL_COMENTARIOS = data.TOTAL_COMENTARIOS
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