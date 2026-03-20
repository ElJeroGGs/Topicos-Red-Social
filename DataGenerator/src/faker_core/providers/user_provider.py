from faker.providers import BaseProvider

class UserProvider(BaseProvider):

    def user_node(self, id):
        fake = self.generator

        return {
            "internal_id:ID(User)": id,
            "username": fake.user_name(),
            "nombre": fake.first_name(),
            "apellido": fake.last_name(),
            "correo": fake.email(),
            "password_hash": fake.sha256(),
            "bio": fake.text(max_nb_chars=50),
            "fecha_registro": fake.date(),
            "fecha_nacimiento": fake.date(),
            "foto_perfil_url": fake.image_url(),
            "status": "activo"
        }