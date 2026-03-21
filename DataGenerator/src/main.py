# Aqui iniciara la ejecucion del programa
from generators import Ciudades, Comentarios, Hashtags, Grupos, Usuarios, Categorias
from generators.relaciones import Usuarios as Usuarios_relaciones
from generators.relaciones import Comentarios as Comentarios_relaciones
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

def generar_usuarios(n):
    for i in range(n):
        yield Usuarios.generar_usuario(i)

if __name__ == "__main__":
    # Escribir datos en CSV
    print("Generando ciudades...")
    write_csv(
        archivo_final(path, "cities.csv"), 
        Ciudades.generar_ciudades(), 
        fieldnames=["internal_id:(Ciudad)", "nombre", "estado", "pais"]
    )

    print("Generando comentarios...")
    write_csv(
        archivo_final(path, "comments.csv"),
        generar_comentarios(2_000_000),
        fieldnames=["internal_id:(Comentario)", "contenido", "fecha_comentario", "status"]
    )

    # Hashtags
    print("Generando hashtags...")
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
    print("Generando usuarios...")
    write_csv(
        archivo_final(path, "usuarios.csv"),
        generar_usuarios(2_000_000),
        fieldnames=[
            "internal_id:ID(Usuario)",
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
    print("Generando categorias...")
    write_csv(
        archivo_final(path, "categorias.csv"),
        Categorias.generar_n_categorias(100),
        fieldnames=[
            "internal_id:ID(Categoria)",
            "nombre",
            "descripcion"
        ]
    )

    ###### Relaciones

    print("Generando relaciones Usuario sigue Usuario...")
    write_csv(
        archivo_final(path, "usuario_sigue_usuario.csv"),
        Usuarios_relaciones.Usuario_sigue_Usuario.generar_relaciones(),
        fieldnames=[
            ":START_ID(Usuario)",
            ":END_ID(Usuario)",
            "fecha_relacion"
        ]
    )

    print("Generando Usuario bloquea Usuario...")
    write_csv(
        archivo_final(path, "usuario_bloquea_usuario.csv"),
        Usuarios_relaciones.Usuario_bloquea_Usuario.generar_bloqueos(),
        fieldnames=[
            ":START_ID(Usuario)",
            ":END_ID(Usuario)",
            "fecha_relacion"
        ]
    )

    print("Generando Usuario comenta Comentario...")
    write_csv(
        archivo_final(path, "usuario_comenta_comentario.csv"),
        Usuarios_relaciones.Usuario_comenta_Comentario.generar_comenta(),
        fieldnames=[
            ":START_ID(Usuario)",
            ":END_ID(Comentario)",
            "fecha_relacion"
        ]
    )

    print("Generando Usuario reacciona Comentario...")
    write_csv(
        archivo_final(path, "usuario_reacciona_comentario.csv"),
        Usuarios_relaciones.Usuario_reacciona_Comentario.generar_reacciones(),
        fieldnames=[
            ":START_ID(Usuario)",
            ":END_ID(Comentario)",
            "fecha_relacion"
        ]
    )

    print("Generando Usuario pertenece Grupo...")
    write_csv(
        archivo_final(path, "usuario_pertenece_grupo.csv"),
        Usuarios_relaciones.Usuario_pertenece_Grupo.generar_pertenece(),
        fieldnames=[
            ":START_ID(Usuario)",
            ":END_ID(Grupo)",
            "fecha_relacion"
        ]
    )

    print("Generando Usuario vive Ciudad...")
    write_csv(
        archivo_final(path, "usuario_vive_ciudad.csv"),
        Usuarios_relaciones.Usuario_vive_Ciudad.generar_vive_en(),
        fieldnames=[
            ":START_ID(Usuario)",
            ":END_ID(Ciudad)"
        ]
    )

    print("Generando Usuario nacio Ciudad...")
    write_csv(
        archivo_final(path, "usuario_nacio_ciudad.csv"),
        Usuarios_relaciones.Usuario_vive_Ciudad.generar_nacio_en(),
        fieldnames=[
            ":START_ID(Usuario)",
            ":END_ID(Ciudad)"
        ]
    )

    print("Generando Comentario responde a Comentario...")
    write_csv(
        archivo_final(path, "comentario_respuesta_comentario.csv"),
        Comentarios_relaciones.Comentario_respuestaa_Comentario.generar_respuestas(),
        fieldnames=[
            ":START_ID(Comentario)",
            ":END_ID(Comentario)",
            "fecha_relacion"
        ]
    )
