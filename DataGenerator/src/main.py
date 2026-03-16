# Aqui iniciara la ejecucion del programa
from generators import Ciudades
from writer.csv_writer import write_csv
import os

path = "Output"
full_path = os.path.abspath(path)
print(f"Los archivos se guardaran en: {full_path}")

if __name__ == "__main__":
    # Escribir datos en CSV
    write_csv(full_path + "/cities.csv", Ciudades.generar_ciudades(), fieldnames=["internal_id:(Ciudad)", "nombre", "estado", "pais"])