import random
from generators.Base_data import Data
data = Data()

TOTAL_USUARIOS = data.TOTAL_USUARIOS
TOTAL_PUBLICACIONES = data.TOTAL_PUBLICACIONES
PORCENTAJE_ACTIVOS = 0.7

usuarios = list(range(TOTAL_USUARIOS))
random.shuffle(usuarios)

usuarios_activos = usuarios[:int(TOTAL_USUARIOS * PORCENTAJE_ACTIVOS)]


def acciones_count():
    # Número de acciones por usuario
    r = random.random()
    if r < 0.5:
        return 1
    elif r < 0.85:
        return 2
    elif r < 0.95:
        return 3
    else:
        return random.randint(4, 5)


def generar_relaciones_accion(tipo="reacciona"):
    for user in usuarios_activos:
        cantidad = acciones_count()
        publicaciones = set()

        while len(publicaciones) < cantidad:
            publicaciones.add(random.randint(0, TOTAL_PUBLICACIONES - 1))

        for publicacion in publicaciones:
            yield {
                ":START_ID(Usuario)": user,
                ":END_ID(Publicacion)": publicacion,
                "tipo": tipo
            }