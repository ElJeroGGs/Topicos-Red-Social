from faker.providers import BaseProvider

class CategoriaProvider(BaseProvider):

    def categoria_node(self, id):
        fake = self.generator

        return {
            "internal_id:ID(Categoria)": id,
            "nombre": fake.word(),
            "descripcion": fake.text(max_nb_chars=40)
        }
    