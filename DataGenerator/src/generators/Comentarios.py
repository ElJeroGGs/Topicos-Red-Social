from faker_core.faker_instance import fake

def generar_comentario(id):
    return fake.comment(id=id)

def generar_texto_comentario():
    return fake.text_comment()

def generar_timestamp_comentario():
    return fake.timestamp_comment()

def generar_status_comentario():
    return fake.status_comment()