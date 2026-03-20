from faker_core.faker_instance import fake

def generar_n_categorias(n):
    return [fake.categoria_node(i) for i in range(n)]
