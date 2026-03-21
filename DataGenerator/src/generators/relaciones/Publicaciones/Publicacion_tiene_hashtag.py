import random
from generators.Base_data import Data

data = Data()
TOTAL_PUBLICACIONES = data.TOTAL_PUBLICACIONES
TOTAL_HASHTAGS = data.TOTAL_HASHTAGS
PORCENTAJE_CON_HASHTAG = 0.5  # 50% de publicaciones tienen hashtag

# Seleccionamos publicaciones que tendrán hashtag
publicaciones = list(range(TOTAL_PUBLICACIONES))
random.shuffle(publicaciones)
publicaciones_con_hashtag = publicaciones[:int(TOTAL_PUBLICACIONES * PORCENTAJE_CON_HASHTAG)]


def generar_publicacion_hashtag():
    for publicacion in publicaciones_con_hashtag:
        hashtag = random.randint(1, TOTAL_HASHTAGS)  # 1 a 500

        yield {
            ":START_ID(Publicacion)": publicacion,
            ":END_ID(Hashtag)": hashtag
        }