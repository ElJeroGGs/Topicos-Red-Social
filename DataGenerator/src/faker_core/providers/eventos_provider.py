from faker.providers import BaseProvider
from datetime import timedelta

class EventosProvider(BaseProvider):
    def evento(self, id):
        fake = self.generator

        fecha_inicio = fake.date_time()
        fecha_fin = (fecha_inicio + timedelta(days=fake.random_int(min=1, max=5)))

        return {
            "internal_id:ID(Evento)": id,
            "titulo": fake.word(),
            "descripcion": fake.text(max_nb_chars=200).replace("\n", " "),
            "fecha_inicio": fecha_inicio,
            "fecha_fin": fecha_fin,
            "modalidad": fake.random_element(["virtual", "presencial"]),
            "lugar": fake.city() if fake.random_element(["virtual", "presencial"]) == "presencial" else None,
            "capacidad": fake.random_int(min=10, max=1000),
            "estatus": fake.random_element(["activo", "cancelado"])
        }