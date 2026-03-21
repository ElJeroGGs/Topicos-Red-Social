from faker.providers import BaseProvider

class PublicationProvider(BaseProvider):
    TIPOS_CONTENIDO = ["texto", "imagen", "video"]
    VISIBILIDADES = ["publico", "privado"]
    ESTATUS = ["activo", "eliminado"]

    def publication(self, id):
        contenido = self.generator.text(max_nb_chars=200).replace("\n", " ")

        return {
            "internal_id:ID(Publicacion)": id,
            "contenido": contenido,
            "tipo_contenido": self.random_element(self.TIPOS_CONTENIDO),
            "visibilidad": self.random_element(self.VISIBILIDADES),
            "estatus": self.random_element(self.ESTATUS),
        }