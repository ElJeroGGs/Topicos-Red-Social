from faker_core.faker_instance import fake


def generar_hashtags(n=200):
    hashtags = []
    for i in range(1, n + 1):
        hashtags.append({
            "id_hashtag:ID(Hashtag)": i,
            "nombre": fake.hashtag_name(),
            "descripcion": fake.hashtag_description(),
            "fecha_creacion": fake.date_time_this_year().isoformat()
        })
    return hashtags