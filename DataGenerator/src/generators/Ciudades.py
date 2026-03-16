from faker_core.faker_instance import fake

def generar_ciudades():
    return fake.all_cities()

def generar_ciudad():
    return fake.city_node()

def generar_ciudad_id():
    return fake.city_id()

def contar_ciudades():
    return fake.city_count()

def generar_n_ciudades(n):
    return [fake.city_node() for _ in range(n)]