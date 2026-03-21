import random

TOTAL_USUARIOS = 2_000_000
TOTAL_CIUDADES = 82
PORCENTAJE = 0.5

usuarios = list(range(TOTAL_USUARIOS))
random.shuffle(usuarios)

usuarios_con_ciudad = usuarios[:int(TOTAL_USUARIOS * PORCENTAJE)]


def generar_vive_en():
    for user in usuarios_con_ciudad:
        ciudad = random.randint(1, TOTAL_CIUDADES)

        yield {
            ":START_ID(Usuario)": user,
            ":END_ID(Ciudad)": ciudad
        }

def generar_nacio_en():
    for user in usuarios_con_ciudad:
        ciudad = random.randint(1, TOTAL_CIUDADES)

        yield {
            ":START_ID(Usuario)": user,
            ":END_ID(Ciudad)": ciudad
        }