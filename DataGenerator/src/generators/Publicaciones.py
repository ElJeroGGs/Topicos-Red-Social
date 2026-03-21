from faker_core.faker_instance import fake

def generar_publicaciones(n, usuarios_ids, categorias_ids):
    data = []

    for i in range(1, n+1):
        pub = fake.publication(i, usuarios_ids, categorias_ids)
        data.append(pub)

    return data