from faker import Faker

# Providers personalizados
from .providers.city_provider import CityProvider

# Configuración de Faker
seed = 42
locations = ["en_US", "es_MX",]

fake = Faker(locations)
Faker.seed(seed)

for factory in fake._factories:
    # Si realizas un provider personalizado, recuerda agregarlo a esta instancia de Faker para que se pueda usar en todo el proyecto.
    # fake.add_provider(CustomProvider)
    factory.add_provider(CityProvider)
