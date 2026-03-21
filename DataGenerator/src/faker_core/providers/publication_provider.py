from faker.providers import BaseProvider
import random

class PublicationProvider(BaseProvider):

    def publication(self, id_publicacion, usuarios_ids, categorias_ids):
        return {
            "internal_id:(Publicacion)": id_publicacion,
            "id_usuario": random.choice(usuarios_ids),
            "id_categoria": random.choice(categorias_ids),
            "contenido": self.generator.text(max_nb_chars=200),
            "tipo_contenido": random.choice(["texto", "imagen", "video"]),
            "visibilidad": random.choice(["publico", "privado"]),
            "ubicacion_texto": self.generator.city(),
            "estatus": random.choice(["activo", "eliminado"])
        }