from faker import Faker
import random
import csv
from datetime import timedelta

fake = Faker()

usuarios_ids = list(range(1, 101))
categorias_ids = list(range(1, 11))
ciudades_ids = list(range(1, 21))

publicaciones = []
for i in range(100):
    publicaciones.append([
        i,
        random.choice(usuarios_ids),
        random.choice(categorias_ids),
        fake.text(100),
        random.choice(["texto", "imagen", "video"]),
        random.choice(["publico", "privado"]),
        fake.date_time(),
        fake.city(),
        random.choice(["activo", "eliminado"])
    ])

with open("publicaciones.csv", "w", newline="", encoding="utf-8") as f:
    writer = csv.writer(f)
    writer.writerow(["id","usuario","categoria","contenido","tipo","visibilidad","fecha","ubicacion","estatus"])
    writer.writerows(publicaciones)

print("Listo 🚀")