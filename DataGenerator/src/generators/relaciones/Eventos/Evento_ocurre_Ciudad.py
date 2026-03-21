import random
from generators.Base_data import Data

data = Data()
TOTAL_EVENTOS = data.TOTAL_EVENTOS
TOTAL_CIUDADES = data.TOTAL_CIUDADES

def generar_evento_ocurre():
    for evento in range(TOTAL_EVENTOS):
        # Distribución aleatoria
        ciudad = random.randint(1, TOTAL_CIUDADES)

        yield {
            ":START_ID(Evento)": evento,
            ":END_ID(Ciudad)": ciudad
        }