import random
from datetime import datetime
from generators.Base_data import Data

data = Data()
TOTAL_COMENTARIOS = data.TOTAL_COMENTARIOS
PORCENTAJE = 0.4

comentarios = list(range(TOTAL_COMENTARIOS))
random.shuffle(comentarios)

comentarios_con_respuesta = comentarios[:int(TOTAL_COMENTARIOS * PORCENTAJE)]

fecha_inicio = datetime(2020, 1, 1)
fecha_fin = datetime(2026, 1, 1)

BASE_TS = int(fecha_inicio.timestamp())
RANGO_TS = int((fecha_fin - fecha_inicio).total_seconds())


def random_fecha():
    r = random.random() ** 2
    return datetime.fromtimestamp(
        BASE_TS + int(r * RANGO_TS)
    ).isoformat()


def generar_respuestas():
    for comentario in comentarios_con_respuesta:

        # evitar que el primer comentario intente responder
        if comentario == 0:
            continue

        destino = random.randint(0, comentario - 1)

        yield {
            ":START_ID(Comentario)": comentario,
            ":END_ID(Comentario)": destino,
            "fecha_relacion": random_fecha()
        }