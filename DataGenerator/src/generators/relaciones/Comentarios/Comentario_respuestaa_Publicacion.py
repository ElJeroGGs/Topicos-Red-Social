import random
from datetime import datetime

TOTAL_COMENTARIOS = 2_000_000
TOTAL_PUBLICACIONES = 2_000_000
PORCENTAJE_PUBLICACIONES_CON_COMENTARIOS = 0.65  # 65% de publicaciones reciben comentarios

publicaciones = list(range(TOTAL_PUBLICACIONES))
random.shuffle(publicaciones)

publicaciones_activas = publicaciones[:int(TOTAL_PUBLICACIONES * PORCENTAJE_PUBLICACIONES_CON_COMENTARIOS)]

fecha_inicio = datetime(2020, 1, 1)
fecha_fin = datetime(2026, 1, 1)
BASE_TS = int(fecha_inicio.timestamp())
RANGO_TS = int((fecha_fin - fecha_inicio).total_seconds())


def random_fecha():
    r = random.random() ** 2
    return datetime.fromtimestamp(
        BASE_TS + int(r * RANGO_TS)
    ).isoformat()


def generar_comentario_a_publicacion():
    for comentario_id in range(TOTAL_COMENTARIOS):
        # Elegir publicación activa
        publicacion = random.choice(publicaciones_activas)

        yield {
            ":START_ID(Comentario)": comentario_id,
            ":END_ID(Publicacion)": publicacion,
            "fecha_relacion": random_fecha()
        }