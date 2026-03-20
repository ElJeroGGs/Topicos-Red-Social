from faker import Faker

# Providers personalizados
from .providers.city_provider import CityProvider
from .providers.hashtag_provider import HashtagProvider
from .providers.grupos_provider import GroupProvider
from .providers.user_provider import UserProvider
from .providers.categoria_provider import CategoriaProvider

# Configuración de Faker
seed = 42
locations = ["en_US", "es_MX",]

fake = Faker(locations)
Faker.seed(seed)

for factory in fake._factories:
    # Si realizas un provider personalizado, recuerda agregarlo a esta instancia de Faker para que se pueda usar en todo el proyecto.
    # fake.add_provider(CustomProvider)
    factory.add_provider(CityProvider)
    factory.add_provider(HashtagProvider)
    factory.add_provider(GroupProvider)
    factory.add_provider(UserProvider)
    factory.add_provider(CategoriaProvider)
    
    
