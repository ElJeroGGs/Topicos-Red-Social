# Aqui iniciara la ejecucion del programa
from generators import Ciudades, Comentarios, Hashtags, Grupos
from writer.csv_writer import write_csv
import os

path = "Output"
os.makedirs(path, exist_ok=True)


print(f"Los archivos se guardaran en: {os.path.abspath(path)}")

def archivo_final(path, filename):
    return os.path.join(os.path.abspath(path), filename)

def generar_comentarios(n):
    for i in range(n):
        yield Comentarios.generar_comentario(i)

if __name__ == "__main__":
    # Escribir datos en CSV
    write_csv(
        archivo_final(path, "cities.csv"), 
        Ciudades.generar_ciudades(), 
        fieldnames=["internal_id:(Ciudad)", "nombre", "estado", "pais"]
    )

    write_csv(
        archivo_final(path, "comments.csv"),
        generar_comentarios(4_000_000),
        fieldnames=["internal_id:(Comentario)", "contenido", "fecha_comentario", "status"]
    )
    #write_csv(full_path + "/cities.csv", Ciudades.generar_ciudades(), fieldnames=["internal_id:(Ciudad)", "nombre", "estado", "pais"])

    # Hashtags
    write_csv(
        archivo_final(path, "hashtags.csv"), 
        Hashtags.generar_hashtags(500), 
        fieldnames=["id_hashtag:ID(Hashtag)", "nombre", "descripcion", "fecha_creacion"]
    )
    
    # Grupos
    write_csv(
        archivo_final(path, "groups.csv"), 
        Grupos.generar_grupos(1000), 
        fieldnames=["id_grupo:ID(Grupo)", "nombre", "descripcion", "privacidad", "fecha_creacion", "id_creador", "id_categoria", "estatus"]
    )
