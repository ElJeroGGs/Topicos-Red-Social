import random
from datetime import datetime
from generators.Base_data import Data

data = Data()
TOTAL_USUARIOS = data.TOTAL_USUARIOS
TOTAL_GRUPOS = data.TOTAL_GRUPOS
PORCENTAJE = 0.35

usuarios = list(range(TOTAL_USUARIOS))
random.shuffle(usuarios)

usuarios_activos = usuarios[:int(TOTAL_USUARIOS * PORCENTAJE)]

# Control de tamaño de grupos
grupo_size = {i: 0 for i in range(TOTAL_GRUPOS)}
MAX_GRUPO = 3000  # límite suave

fecha_inicio = datetime(2020, 1, 1)
fecha_fin = datetime(2026, 1, 1)

BASE_TS = int(fecha_inicio.timestamp())
RANGO_TS = int((fecha_fin - fecha_inicio).total_seconds())


def random_fecha():
    r = random.random() ** 2
    return datetime.fromtimestamp(
        BASE_TS + int(r * RANGO_TS)
    ).isoformat()


def grupos_count():
    r = random.random()
    if r < 0.6:
        return 1
    elif r < 0.9:
        return 2
    else:
        return 3


def generar_pertenece():
    for user in usuarios_activos:
        cantidad = grupos_count()

        asignados = set()
        intentos = 0

        while len(asignados) < cantidad and intentos < 10:
            grupo = random.randint(0, TOTAL_GRUPOS - 1)

            if grupo_size[grupo] < MAX_GRUPO:
                asignados.add(grupo)
                grupo_size[grupo] += 1

            intentos += 1

        for grupo in asignados:
            yield {
                ":START_ID(Usuario)": user,
                ":END_ID(Grupo)": grupo,
                "fecha_relacion": random_fecha()
            }