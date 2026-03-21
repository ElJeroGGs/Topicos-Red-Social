from faker_core.faker_instance import fake

def generar_grupos(n=1000):
    grupos = []
    for i in range(1, n + 1):
        grupos.append({
            "id_grupo:ID(Grupo)": i,
            "nombre": fake.group_name(),
            "descripcion": fake.sentence(nb_words=10),
            "privacidad": fake.group_privacy(),
            "fecha_creacion": fake.date_this_year().isoformat(),
            "estatus": fake.group_status()
        })
    return grupos