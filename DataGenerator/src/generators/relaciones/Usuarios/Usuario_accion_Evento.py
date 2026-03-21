import random

TOTAL_USUARIOS = 2_000_000
TOTAL_EVENTOS = 500
PORCENTAJE_ACTIVOS = 0.7
MAX_ORGANIZADORES = 50


usuarios = list(range(TOTAL_USUARIOS))
random.shuffle(usuarios)

usuarios_activos = usuarios[:int(TOTAL_USUARIOS * PORCENTAJE_ACTIVOS)]


def acciones_count():
    r = random.random()
    if r < 0.5:
        return 1
    elif r < 0.85:
        return 2
    elif r < 0.95:
        return 3
    else:
        return random.randint(4, 5)


def generar_relaciones_evento(tipo="guarda"):
    # relaciones "guarda" o "asiste"
    for user in usuarios_activos:
        cantidad = acciones_count()
        eventos = set()

        while len(eventos) < cantidad:
            eventos.add(random.randint(0, TOTAL_EVENTOS - 1))

        for evento in eventos:
            yield {
                ":START_ID(Usuario)": user,
                ":END_ID(Evento)": evento,
                "tipo": tipo
            }


def generar_organizadores():
    # Elegir máximo 50 organizadores
    organizadores = random.sample(range(TOTAL_USUARIOS), MAX_ORGANIZADORES)

    for user in organizadores:
        cantidad = acciones_count()
        eventos = set()

        while len(eventos) < cantidad:
            eventos.add(random.randint(0, TOTAL_EVENTOS - 1))

        for evento in eventos:
            yield {
                ":START_ID(Usuario)": user,
                ":END_ID(Evento)": evento,
                "tipo": "organiza"
            }