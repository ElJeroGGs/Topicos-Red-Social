from faker_core.faker_instance import fake

def generar_n_usuarios(n):
    return [fake.user_node(i) for i in range(n)]

def generar_usuario(i):
    return fake.user_node(i)