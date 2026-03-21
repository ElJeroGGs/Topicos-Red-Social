import random

TOTAL_PUBLICACIONES = 2_000_000
TOTAL_CIUDADES = 82
PORCENTAJE_CON_CIUDAD = 0.4  # 40% de publicaciones tienen ubicación

# Seleccionar publicaciones con ciudad
publicaciones = list(range(TOTAL_PUBLICACIONES))
random.shuffle(publicaciones)
publicaciones_con_ciudad = publicaciones[:int(TOTAL_PUBLICACIONES * PORCENTAJE_CON_CIUDAD)]


def generar_publicacion_en_ciudad():
    for publicacion in publicaciones_con_ciudad:
        ciudad = random.randint(1, TOTAL_CIUDADES)  # 1 a 82

        yield {
            ":START_ID(Publicacion)": publicacion,
            ":END_ID(Ciudad)": ciudad
        }