# Aqui iniciara la ejecucion del programa
from generators import Ciudades
from writer.csv_writer import write_csv
import os

path = "Output"
os.makedirs(path, exist_ok=True)


print(f"Los archivos se guardaran en: {os.path.abspath(path)}")

def archivo_final(path, filename):
    return os.path.join(os.path.abspath(path), filename)

if __name__ == "__main__":
    # Escribir datos en CSV
    write_csv(
        archivo_final(path, "cities.csv"), 
        Ciudades.generar_ciudades(), 
        fieldnames=["internal_id:(Ciudad)", "nombre", "estado", "pais"]
    )