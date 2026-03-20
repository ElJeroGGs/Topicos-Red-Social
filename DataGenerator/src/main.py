# Aqui iniciara la ejecucion del programa
from generators import Ciudades
from generators import Hashtags
from generators import Grupos
from generators import Usuarios
from generators import Categorias
from writer.csv_writer import write_csv
import os

path = "Output"
os.makedirs(path, exist_ok=True)


print(f"Los archivos se guardaran en: {os.path.abspath(path)}")

def archivo_final(path, filename):
    return os.path.join(os.path.abspath(path), filename)

if __name__ == "__main__":
    # Escribir datos en CSV
    write_csv(
        archivo_final(path, "cities.csv"), 
        Ciudades.generar_ciudades(), 
        fieldnames=["internal_id:(Ciudad)", "nombre", "estado", "pais"]
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

    # Usuarios
    write_csv(
        archivo_final(path, "usuarios.csv"),
        Usuarios.generar_n_usuarios(1000),
        fieldnames=[
            "internal_id:ID(User)",
            "username",
            "nombre",
            "apellido",
            "correo",
            "password_hash",
            "bio",
            "fecha_registro",
            "fecha_nacimiento",
            "foto_perfil_url",
            "status"
        ]
    )

    # Categorias
    write_csv(
        archivo_final(path, "categorias.csv"),
        Categorias.generar_n_categorias(100),
        fieldnames=[
            "internal_id:ID(Category)",
            "nombre",
            "descripcion"
        ]
    )