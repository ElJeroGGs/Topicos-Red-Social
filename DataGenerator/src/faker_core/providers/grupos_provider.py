from faker.providers import BaseProvider

class GroupProvider(BaseProvider):
    def group_name(self):
        temas = [
            'Linux',
            'PostgreSQL',
            'Pythonistas',
            'Gaming',
            'Senderismo',
            'DevOps',
            'Ciberseguridad',
            'Inteligencia Artificial',
            'Ciencia de Datos',
            'Machine Learning',
            'Desarrollo Web',
            'Desarrollo Móvil',
            'Backend con Python',
            'Frontend con React',
            'Bases de Datos',
            'Docker y Kubernetes',
            'Cloud Computing',
            'Open Source',
            'Videojuegos Indie',
            'eSports',
            'Anime y Manga',
            'Cómics',
            'Cine y Series',
            'Fotografía',
            'Diseño UX/UI',
            'Arte Digital',
            'Música en Vivo',
            'Producción Musical',
            'Lectura y Libros',
            'Escritura Creativa',
            'Emprendimiento',
            'Marketing Digital',
            'Finanzas Personales',
            'Criptomonedas',
            'Viajes por México',
            'Viajes por Estados Unidos',
            'Comida Mexicana',
            'Cocina Internacional',
            'Fitness y Gimnasio',
            'Ciclismo',
            'Running',
            'Yoga y Bienestar',
            'Medio Ambiente',
            'Mascotas',
            'Jardinería',
            'Astronomía',
            'Historia',
            'Idiomas',
            'Intercambio Cultural',
            'Eventos y Networking'
        ]
        return f"Grupo de {self.random_element(temas)}"

    def group_privacy(self):
        return self.random_element(['público', 'privado'])

    def group_status(self):
        return self.random_element(['activo', 'inactivo'])