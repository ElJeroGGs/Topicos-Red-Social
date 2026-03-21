import random
from generators.Base_data import Data

data = Data()
TOTAL_USUARIOS = data.TOTAL_USUARIOS
TOTAL_CIUDADES = data.TOTAL_CIUDADES
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