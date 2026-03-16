# Aqui iniciara la ejecucion del programa
from generators import Ciudades
from writer.csv_writer import write_csv
import os

path = "Output"
os.makedirs(path, exist_ok=True)

full_path = os.path.join(os.path.abspath(path), "cities.csv")
print(f"Los archivos se guardaran en: {full_path}")

if __name__ == "__main__":
    # Escribir datos en CSV
    write_csv(full_path, Ciudades.generar_ciudades(), fieldnames=["internal_id:(Ciudad)", "nombre", "estado", "pais"])