import random

TOTAL_EVENTOS = 500
TOTAL_CIUDADES = 82

def generar_evento_ocurre():
    for evento in range(TOTAL_EVENTOS):
        # Distribución aleatoria
        ciudad = random.randint(1, TOTAL_CIUDADES)

        yield {
            ":START_ID(Evento)": evento,
            ":END_ID(Ciudad)": ciudad
        }