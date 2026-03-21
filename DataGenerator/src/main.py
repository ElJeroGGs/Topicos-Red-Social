# Aqui iniciara la ejecucion del programa
from generators import Ciudades, Comentarios, Hashtags, Grupos, Usuarios, Categorias, Publicaciones, Eventos
from generators.relaciones import Usuarios as Usuarios_relaciones
from generators.relaciones import Comentarios as Comentarios_relaciones
from generators.relaciones import Eventos as Eventos_relaciones
from generators.relaciones import Publicaciones as Publicaciones_relaciones
from writer.csv_writer import write_csv
from generators.Base_data import Data
import os
import time

path = "Output"
os.makedirs(path, exist_ok=True)
data = Data()


print(f"Los archivos se guardaran en: {os.path.abspath(path)}")

def archivo_final(path, filename):
    return os.path.join(os.path.abspath(path), filename)

def generar_comentarios(n):
    for i in range(n):
        yield Comentarios.generar_comentario(i)

def generar_usuarios(n):
    for i in range(n):
        yield Usuarios.generar_usuario(i)

def generar_publicaciones(n):
    for i in range(n):
        yield Publicaciones.gen_publicacion(i)

def generar_eventos(n):
    for i in range(n):
        yield Eventos.gen_eventos(i)

if __name__ == "__main__":
    inicio = time.time()
    print("Iniciando generación de datos a las ", time.ctime(inicio))

    print("Generando publicaciones...")
    write_csv(
        archivo_final(path, "publicaciones.csv"),
        generar_publicaciones(data.TOTAL_PUBLICACIONES),
        fieldnames=[
            "internal_id:ID(Publicacion)",
            "contenido",
            "tipo_contenido",
            "visibilidad",
            "estatus"
        ]
    )

    print("Generando eventos...")
    write_csv(
        archivo_final(path, "eventos.csv"),
        generar_eventos(data.TOTAL_EVENTOS),
        fieldnames=[
            "internal_id:ID(Evento)",
            "titulo",
            "descripcion",
            "fecha_inicio",
            "fecha_fin",
            "modalidad",
            "lugar",
            "capacidad",
            "estatus"
        ]
    )

    # Escribir datos en CSV
    print("Generando ciudades...")
    write_csv(
        archivo_final(path, "cities.csv"), 
        Ciudades.generar_ciudades(), 
        fieldnames=["internal_id:ID(Ciudad)", "nombre", "estado", "pais"]
    )

    print("Generando comentarios...")
    write_csv(
        archivo_final(path, "comments.csv"),
        generar_comentarios(data.TOTAL_COMENTARIOS),
        fieldnames=["internal_id:ID(Comentario)", "contenido", "status"]
    )

    # Hashtags
    print("Generando hashtags...")
    write_csv(
        archivo_final(path, "hashtags.csv"), 
        Hashtags.generar_hashtags(data.TOTAL_HASHTAGS), 
        fieldnames=["id_hashtag:ID(Hashtag)", "nombre", "descripcion", "fecha_creacion"]
    )
    
    # Grupos
    write_csv(
        archivo_final(path, "groups.csv"), 
        Grupos.generar_grupos(data.TOTAL_GRUPOS), 
        fieldnames=["id_grupo:ID(Grupo)", "nombre", "descripcion", "privacidad", "fecha_creacion", "id_creador", "id_categoria", "estatus"]
    )

    # Usuarios
    print("Generando usuarios...")
    write_csv(
        archivo_final(path, "usuarios.csv"),
        generar_usuarios(data.TOTAL_USUARIOS),
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
        Categorias.generar_n_categorias(data.TOTAL_CATEGORIAS),
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

    print("Generando Usuario publica Publicacion...")
    write_csv(
        archivo_final(path, "usuario_publica_publicacion.csv"),
        Usuarios_relaciones.Usuario_publica_Publicacion.generar_publica(),
        fieldnames=[
            ":START_ID(Usuario)",
            ":END_ID(Publicacion)",
            "fecha_relacion"
        ]
    )
    
    print("Generando Usuario reacciona Publicacion...")
    write_csv(
        archivo_final(path, "usuario_reacciona_publicacion.csv"),
        Usuarios_relaciones.Usuario_accion_Publicacion.generar_relaciones_accion(tipo="reacciona"),
        fieldnames=[":START_ID(Usuario)", ":END_ID(Publicacion)", "tipo"]
    )

    print("Generando Usuario comparte Publicacion...")
    write_csv(
        archivo_final(path, 'usuario_comparte_publicacion.csv'),
        Usuarios_relaciones.Usuario_accion_Publicacion.generar_relaciones_accion(tipo="comparte"),
        fieldnames=[":START_ID(Usuario)", ":END_ID(Publicacion)", "tipo"]
    )

    print("Generando Usuario guarda Publicacion...")
    write_csv(
        archivo_final(path, 'usuario_guarda_publicacion.csv'),
        Usuarios_relaciones.Usuario_accion_Publicacion.generar_relaciones_accion(tipo="guarda"),
        fieldnames=[":START_ID(Usuario)", ":END_ID(Publicacion)", "tipo"]
    )

    print("Generando Usuario guarda Evento...")
    write_csv(
        archivo_final(path, "guarda_evento.csv"),
        Usuarios_relaciones.Usuario_accion_Evento.generar_relaciones_evento(tipo="guarda"),
        fieldnames=[":START_ID(Usuario)", ":END_ID(Evento)", "tipo"]
    )

    print("Generando Usuario asiste Evento...")
    write_csv(
        archivo_final(path, "asiste_evento.csv"),
        Usuarios_relaciones.Usuario_accion_Evento.generar_relaciones_evento(tipo="asiste"),
        fieldnames=[":START_ID(Usuario)", ":END_ID(Evento)", "tipo"]
    )

    print("Generando Usuario organiza Evento...")
    write_csv(
        archivo_final(path, "organiza_evento.csv"),
        Usuarios_relaciones.Usuario_accion_Evento.generar_organizadores(),
        fieldnames=[":START_ID(Usuario)", ":END_ID(Evento)", "tipo"]
    )

    print("Generando Evento ocurre Ciudad...")
    write_csv(
        archivo_final(path, "evento_ocurre_ciudad.csv"),
        Eventos_relaciones.Evento_ocurre_Ciudad.generar_evento_ocurre(),
        fieldnames=[":START_ID(Evento)", ":END_ID(Ciudad)"]
    )

    print("Generando Comentario responde a Publicacion...")
    write_csv(
        archivo_final(path, "comentario_respuesta_publicacion.csv"),
        Comentarios_relaciones.Comentario_respuestaa_Publicacion.generar_comentario_a_publicacion(),
        fieldnames=[
            ":START_ID(Comentario)",
            ":END_ID(Publicacion)",
            "fecha_relacion"
        ]
    )

    print("Generando Publicacion ocurre Ciudad...")
    write_csv(
        archivo_final(path, "publicacion_ocurre_ciudad.csv"),
        Publicaciones_relaciones.Publicacion_ocurren_ciudad.generar_publicacion_en_ciudad(),
        fieldnames=[
            ":START_ID(Publicacion)",
            ":END_ID(Ciudad)"
        ]
    )

    print("Generando Publicacion tiene Hashtag...")
    write_csv(
        archivo_final(path, "publicacion_tiene_hashtag.csv"),
        Publicaciones_relaciones.Publicacion_tiene_hashtag.generar_publicacion_hashtag(),
        fieldnames=[
            ":START_ID(Publicacion)",
            ":END_ID(Hashtag)"
        ]
    )

    print("Generando Hashtag pertenece a Categoria...")
    write_csv(
        archivo_final(path, "hashtag_pertenece_categoria.csv"),
        Publicaciones_relaciones.Categoria_coso_hashtag.generar_hashtag_categoria(),
        fieldnames=[
            ":START_ID(Hashtag)",
            ":END_ID(Categoria)"
        ]
    )

    print("Generando Subcategoria...")
    write_csv(
        archivo_final(path, "subcategoria.csv"),
        Publicaciones_relaciones.Categoria_coso_hashtag.generar_subcategoria(),
        fieldnames=[
            ":START_ID(Categoria)",
            ":END_ID(Categoria)"
        ]
    )

    fin = time.time()
    print("Generación de datos finalizada a las ", time.ctime(fin))
    print(f"Tiempo total de generación: {fin - inicio:.2f} segundos")
