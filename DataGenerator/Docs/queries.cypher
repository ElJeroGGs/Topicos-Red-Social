// ============================================================
// MATERIA: TOPICOS DE TECNOLOGIAS DE DATOS
// PROYECTO: RED SOCIAL EN GRAFOS
// BASE DE DATOS: Neo4j
// ARCHIVO: queries.cypher
// DESCRIPCIÓN:
// Conversión del modelo relacional a modelo de grafos.
// ============================================================



// ============================================================
// 0. LIMPIEZA TOTAL
// Ejecutar primero si ya probaste versiones anteriores.
// ============================================================

MATCH (n)
DETACH DELETE n;



// ============================================================
// 1. CONSTRAINTS
// Garantizan unicidad de IDs por tipo de nodo.
// ============================================================

CREATE CONSTRAINT usuario_id IF NOT EXISTS
FOR (u:Usuario) REQUIRE u.id_usuario IS UNIQUE;

CREATE CONSTRAINT publicacion_id IF NOT EXISTS
FOR (p:Publicacion) REQUIRE p.id_publicacion IS UNIQUE;

CREATE CONSTRAINT comentario_id IF NOT EXISTS
FOR (c:Comentario) REQUIRE c.id_comentario IS UNIQUE;

CREATE CONSTRAINT evento_id IF NOT EXISTS
FOR (e:Evento) REQUIRE e.id_evento IS UNIQUE;

CREATE CONSTRAINT grupo_id IF NOT EXISTS
FOR (g:Grupo) REQUIRE g.id_grupo IS UNIQUE;

CREATE CONSTRAINT hashtag_id IF NOT EXISTS
FOR (h:Hashtag) REQUIRE h.id_hashtag IS UNIQUE;

CREATE CONSTRAINT categoria_id IF NOT EXISTS
FOR (cat:Categoria) REQUIRE cat.id_categoria IS UNIQUE;

CREATE CONSTRAINT ciudad_id IF NOT EXISTS
FOR (ci:Ciudad) REQUIRE ci.id_ciudad IS UNIQUE;



// ============================================================
// 2. CREACIÓN DE NODOS
// ============================================================

MERGE (u1:Usuario {id_usuario: 1})
SET u1.username = "raul",
    u1.nombre = "Raul",
    u1.apellido = "Sebastian",
    u1.correo = "raul@mail.com",
    u1.password_hash = "hash1",
    u1.bio = "Usuario 1",
    u1.fecha_registro = datetime("2026-03-01T10:00:00"),
    u1.fecha_nacimiento = date("2000-01-01"),
    u1.foto_perfil_url = "https://foto.com/raul.jpg",
    u1.estatus = "activo";

MERGE (u2:Usuario {id_usuario: 2})
SET u2.username = "ana",
    u2.nombre = "Ana",
    u2.apellido = "Lopez",
    u2.correo = "ana@mail.com",
    u2.password_hash = "hash2",
    u2.bio = "Usuario 2",
    u2.fecha_registro = datetime("2026-03-02T10:00:00"),
    u2.fecha_nacimiento = date("2001-02-02"),
    u2.foto_perfil_url = "https://foto.com/ana.jpg",
    u2.estatus = "activo";

MERGE (u3:Usuario {id_usuario: 3})
SET u3.username = "carlos",
    u3.nombre = "Carlos",
    u3.apellido = "Perez",
    u3.correo = "carlos@mail.com",
    u3.password_hash = "hash3",
    u3.bio = "Usuario 3",
    u3.fecha_registro = datetime("2026-03-03T10:00:00"),
    u3.fecha_nacimiento = date("1999-03-03"),
    u3.foto_perfil_url = "https://foto.com/carlos.jpg",
    u3.estatus = "activo";

MERGE (cat1:Categoria {id_categoria: 1})
SET cat1.nombre = "Tecnologia",
    cat1.descripcion = "Temas de tecnologia";

MERGE (cat2:Categoria {id_categoria: 2})
SET cat2.nombre = "Ciencia",
    cat2.descripcion = "Temas de ciencia";

MERGE (ci1:Ciudad {id_ciudad: 1})
SET ci1.nombre = "Toluca",
    ci1.estado = "Estado de Mexico",
    ci1.pais = "Mexico";

MERGE (ci2:Ciudad {id_ciudad: 2})
SET ci2.nombre = "Metepec",
    ci2.estado = "Estado de Mexico",
    ci2.pais = "Mexico";

MERGE (h1:Hashtag {id_hashtag: 1})
SET h1.nombre = "neo4j",
    h1.descripcion = "Posts sobre neo4j",
    h1.fecha_creacion = datetime("2026-03-01T08:00:00");

MERGE (h2:Hashtag {id_hashtag: 2})
SET h2.nombre = "grafos",
    h2.descripcion = "Posts sobre grafos",
    h2.fecha_creacion = datetime("2026-03-01T09:00:00");

MERGE (p1:Publicacion {id_publicacion: 1})
SET p1.contenido = "Hola mundo",
    p1.tipo_contenido = "texto",
    p1.visibilidad = "publico",
    p1.fecha_publicacion = datetime("2026-03-10T12:00:00"),
    p1.ubicacion_texto = "Toluca centro",
    p1.estatus = "activo";

MERGE (p2:Publicacion {id_publicacion: 2})
SET p2.contenido = "Aprendiendo Neo4j",
    p2.tipo_contenido = "texto",
    p2.visibilidad = "publico",
    p2.fecha_publicacion = datetime("2026-03-11T13:00:00"),
    p2.ubicacion_texto = "Metepec",
    p2.estatus = "activo";

MERGE (c1:Comentario {id_comentario: 1})
SET c1.contenido = "Buen post",
    c1.fecha_comentario = datetime("2026-03-10T13:00:00"),
    c1.estatus = "activo";

MERGE (c2:Comentario {id_comentario: 2})
SET c2.contenido = "Gracias",
    c2.fecha_comentario = datetime("2026-03-10T13:05:00"),
    c2.estatus = "activo";

MERGE (e1:Evento {id_evento: 1})
SET e1.titulo = "Evento Grafos",
    e1.descripcion = "Introduccion a bases de datos de grafos",
    e1.fecha_inicio = datetime("2026-03-20T10:00:00"),
    e1.fecha_fin = datetime("2026-03-20T12:00:00"),
    e1.modalidad = "presencial",
    e1.lugar = "Toluca",
    e1.capacidad = 100,
    e1.estatus = "activo";

MERGE (e2:Evento {id_evento: 2})
SET e2.titulo = "Meetup Ciencia",
    e2.descripcion = "Evento de divulgacion cientifica",
    e2.fecha_inicio = datetime("2026-03-22T16:00:00"),
    e2.fecha_fin = datetime("2026-03-22T18:00:00"),
    e2.modalidad = "hibrido",
    e2.lugar = "Metepec",
    e2.capacidad = 80,
    e2.estatus = "activo";

MERGE (g1:Grupo {id_grupo: 1})
SET g1.nombre = "Grupo Tech",
    g1.descripcion = "Grupo sobre tecnologia",
    g1.privacidad = "publico",
    g1.fecha_creacion = datetime("2026-03-05T18:00:00"),
    g1.estatus = "activo";

MERGE (g2:Grupo {id_grupo: 2})
SET g2.nombre = "Grupo Ciencia",
    g2.descripcion = "Grupo sobre ciencia",
    g2.privacidad = "privado",
    g2.fecha_creacion = datetime("2026-03-06T18:00:00"),
    g2.estatus = "activo";



// ============================================================
// 3. RELACIONES ENTRE USUARIOS
// ============================================================

MATCH (u1:Usuario {id_usuario: 1})
MATCH (u2:Usuario {id_usuario: 2})
MERGE (u1)-[r:SIGUE]->(u2)
SET r.fecha_seguimiento = datetime("2026-03-12T09:00:00");

MATCH (u2:Usuario {id_usuario: 2})
MATCH (u1:Usuario {id_usuario: 1})
MERGE (u2)-[r:SIGUE]->(u1)
SET r.fecha_seguimiento = datetime("2026-03-12T10:00:00");

MATCH (u3:Usuario {id_usuario: 3})
MATCH (u1:Usuario {id_usuario: 1})
MERGE (u3)-[r:SIGUE]->(u1)
SET r.fecha_seguimiento = datetime("2026-03-12T11:00:00");

MATCH (u1:Usuario {id_usuario: 1})
MATCH (u3:Usuario {id_usuario: 3})
MERGE (u1)-[r:BLOQUEA]->(u3)
SET r.fecha_bloqueo = datetime("2026-03-13T10:00:00");



// ============================================================
// 4. RELACIONES DE PUBLICACIONES
// ============================================================

MATCH (u1:Usuario {id_usuario: 1})
MATCH (p1:Publicacion {id_publicacion: 1})
MERGE (u1)-[:PUBLICA]->(p1);

MATCH (u2:Usuario {id_usuario: 2})
MATCH (p2:Publicacion {id_publicacion: 2})
MERGE (u2)-[:PUBLICA]->(p2);

MATCH (u2:Usuario {id_usuario: 2})
MATCH (p1:Publicacion {id_publicacion: 1})
MERGE (u2)-[r:REACCIONA]->(p1)
SET r.tipo = "like",
    r.fecha = datetime("2026-03-10T14:00:00");

MATCH (u3:Usuario {id_usuario: 3})
MATCH (p1:Publicacion {id_publicacion: 1})
MERGE (u3)-[r:REACCIONA]->(p1)
SET r.tipo = "love",
    r.fecha = datetime("2026-03-10T14:10:00");

MATCH (u2:Usuario {id_usuario: 2})
MATCH (p1:Publicacion {id_publicacion: 1})
MERGE (u2)-[r:COMPARTE]->(p1)
SET r.fecha = datetime("2026-03-10T15:00:00");

MATCH (u3:Usuario {id_usuario: 3})
MATCH (p1:Publicacion {id_publicacion: 1})
MERGE (u3)-[r:GUARDA]->(p1)
SET r.fecha = datetime("2026-03-10T16:00:00");

MATCH (u1:Usuario {id_usuario: 1})
MATCH (p2:Publicacion {id_publicacion: 2})
MERGE (u1)-[r:ETIQUETA]->(p2)
SET r.fecha = datetime("2026-03-11T09:00:00");

MATCH (p1:Publicacion {id_publicacion: 1})
MATCH (h1:Hashtag {id_hashtag: 1})
MERGE (p1)-[:TIENE_HASHTAG]->(h1);

MATCH (p1:Publicacion {id_publicacion: 1})
MATCH (h2:Hashtag {id_hashtag: 2})
MERGE (p1)-[:TIENE_HASHTAG]->(h2);

MATCH (p2:Publicacion {id_publicacion: 2})
MATCH (h2:Hashtag {id_hashtag: 2})
MERGE (p2)-[:TIENE_HASHTAG]->(h2);

MATCH (p1:Publicacion {id_publicacion: 1})
MATCH (cat1:Categoria {id_categoria: 1})
MERGE (p1)-[:PERTENECE_A]->(cat1);

MATCH (p2:Publicacion {id_publicacion: 2})
MATCH (cat2:Categoria {id_categoria: 2})
MERGE (p2)-[:PERTENECE_A]->(cat2);

MATCH (p1:Publicacion {id_publicacion: 1})
MATCH (ci1:Ciudad {id_ciudad: 1})
MERGE (p1)-[:UBICADA_EN]->(ci1);

MATCH (p2:Publicacion {id_publicacion: 2})
MATCH (ci2:Ciudad {id_ciudad: 2})
MERGE (p2)-[:UBICADA_EN]->(ci2);



// ============================================================
// 5. RELACIONES DE COMENTARIOS
// ============================================================

MATCH (u2:Usuario {id_usuario: 2})
MATCH (c1:Comentario {id_comentario: 1})
MERGE (u2)-[:COMENTA]->(c1);

MATCH (u1:Usuario {id_usuario: 1})
MATCH (c2:Comentario {id_comentario: 2})
MERGE (u1)-[:COMENTA]->(c2);

MATCH (c1:Comentario {id_comentario: 1})
MATCH (p1:Publicacion {id_publicacion: 1})
MERGE (c1)-[:EN_PUBLICACION]->(p1);

MATCH (c2:Comentario {id_comentario: 2})
MATCH (p1:Publicacion {id_publicacion: 1})
MERGE (c2)-[:EN_PUBLICACION]->(p1);

MATCH (c2:Comentario {id_comentario: 2})
MATCH (c1:Comentario {id_comentario: 1})
MERGE (c2)-[:RESPONDE_A]->(c1);



// ============================================================
// 6. RELACIONES HASHTAG -> CATEGORIA
// ============================================================

MATCH (h1:Hashtag {id_hashtag: 1})
MATCH (cat1:Categoria {id_categoria: 1})
MERGE (h1)-[:ASOCIADO_A]->(cat1);

MATCH (h2:Hashtag {id_hashtag: 2})
MATCH (cat2:Categoria {id_categoria: 2})
MERGE (h2)-[:ASOCIADO_A]->(cat2);



// ============================================================
// 7. RELACIONES DE EVENTOS
// ============================================================

MATCH (u1:Usuario {id_usuario: 1})
MATCH (e1:Evento {id_evento: 1})
MERGE (u1)-[:ORGANIZA]->(e1);

MATCH (u2:Usuario {id_usuario: 2})
MATCH (e2:Evento {id_evento: 2})
MERGE (u2)-[:ORGANIZA]->(e2);

MATCH (u2:Usuario {id_usuario: 2})
MATCH (e1:Evento {id_evento: 1})
MERGE (u2)-[r:ASISTE_A]->(e1)
SET r.fecha_registro = datetime("2026-03-15T09:00:00");

MATCH (u3:Usuario {id_usuario: 3})
MATCH (e1:Evento {id_evento: 1})
MERGE (u3)-[r:ASISTE_A]->(e1)
SET r.fecha_registro = datetime("2026-03-15T09:30:00");

MATCH (u1:Usuario {id_usuario: 1})
MATCH (e2:Evento {id_evento: 2})
MERGE (u1)-[r:ASISTE_A]->(e2)
SET r.fecha_registro = datetime("2026-03-16T10:00:00");

MATCH (e1:Evento {id_evento: 1})
MATCH (ci1:Ciudad {id_ciudad: 1})
MERGE (e1)-[:OCURRE_EN]->(ci1);

MATCH (e2:Evento {id_evento: 2})
MATCH (ci2:Ciudad {id_ciudad: 2})
MERGE (e2)-[:OCURRE_EN]->(ci2);

MATCH (e1:Evento {id_evento: 1})
MATCH (cat1:Categoria {id_categoria: 1})
MERGE (e1)-[:PERTENECE_A]->(cat1);

MATCH (e2:Evento {id_evento: 2})
MATCH (cat2:Categoria {id_categoria: 2})
MERGE (e2)-[:PERTENECE_A]->(cat2);



// ============================================================
// 8. RELACIONES DE GRUPOS
// ============================================================

MATCH (u1:Usuario {id_usuario: 1})
MATCH (g1:Grupo {id_grupo: 1})
MERGE (u1)-[:CREA]->(g1);

MATCH (u2:Usuario {id_usuario: 2})
MATCH (g2:Grupo {id_grupo: 2})
MERGE (u2)-[:CREA]->(g2);

MATCH (u1:Usuario {id_usuario: 1})
MATCH (g1:Grupo {id_grupo: 1})
MERGE (u1)-[:ADMINISTRA]->(g1);

MATCH (u2:Usuario {id_usuario: 2})
MATCH (g2:Grupo {id_grupo: 2})
MERGE (u2)-[:ADMINISTRA]->(g2);

MATCH (u2:Usuario {id_usuario: 2})
MATCH (g1:Grupo {id_grupo: 1})
MERGE (u2)-[r:PERTENECE_A]->(g1)
SET r.rol_en_grupo = "miembro",
    r.fecha_union = datetime("2026-03-07T10:00:00");

MATCH (u3:Usuario {id_usuario: 3})
MATCH (g1:Grupo {id_grupo: 1})
MERGE (u3)-[r:PERTENECE_A]->(g1)
SET r.rol_en_grupo = "moderador",
    r.fecha_union = datetime("2026-03-07T11:00:00");

MATCH (u1:Usuario {id_usuario: 1})
MATCH (g2:Grupo {id_grupo: 2})
MERGE (u1)-[r:PERTENECE_A]->(g2)
SET r.rol_en_grupo = "miembro",
    r.fecha_union = datetime("2026-03-08T10:00:00");

MATCH (g1:Grupo {id_grupo: 1})
MATCH (cat1:Categoria {id_categoria: 1})
MERGE (g1)-[:PERTENECE_A]->(cat1);

MATCH (g2:Grupo {id_grupo: 2})
MATCH (cat2:Categoria {id_categoria: 2})
MERGE (g2)-[:PERTENECE_A]->(cat2);



// ============================================================
// 9. RELACIONES USUARIO -> CIUDAD
// ============================================================

MATCH (u1:Usuario {id_usuario: 1})
MATCH (ci1:Ciudad {id_ciudad: 1})
MERGE (u1)-[:VIVE_EN]->(ci1);

MATCH (u2:Usuario {id_usuario: 2})
MATCH (ci2:Ciudad {id_ciudad: 2})
MERGE (u2)-[:VIVE_EN]->(ci2);

MATCH (u3:Usuario {id_usuario: 3})
MATCH (ci1:Ciudad {id_ciudad: 1})
MERGE (u3)-[:VIVE_EN]->(ci1);

MATCH (u1:Usuario {id_usuario: 1})
MATCH (ci2:Ciudad {id_ciudad: 2})
MERGE (u1)-[:NACIO_EN]->(ci2);

MATCH (u2:Usuario {id_usuario: 2})
MATCH (ci1:Ciudad {id_ciudad: 1})
MERGE (u2)-[:NACIO_EN]->(ci1);

MATCH (u3:Usuario {id_usuario: 3})
MATCH (ci2:Ciudad {id_ciudad: 2})
MERGE (u3)-[:NACIO_EN]->(ci2);



// ============================================================
// 10. QUERIES DE VALIDACIÓN
// Ejecutar una por una.
// ============================================================

// 10.1 Ver todo el grafo conectado
MATCH (n)-[r]->(m)
RETURN n, r, m;

// 10.2 Usuarios que siguen a otros
MATCH (u1:Usuario)-[:SIGUE]->(u2:Usuario)
RETURN u1.username AS seguidor, u2.username AS seguido;

// 10.3 Publicaciones de usuarios
MATCH (u:Usuario)-[:PUBLICA]->(p:Publicacion)
RETURN u.username AS usuario, p.contenido AS publicacion;

// 10.4 Reacciones a publicaciones
MATCH (u:Usuario)-[r:REACCIONA]->(p:Publicacion)
RETURN u.username AS usuario, r.tipo AS tipo_reaccion, p.contenido AS publicacion;

// 10.5 Comentarios de publicaciones
MATCH (u:Usuario)-[:COMENTA]->(c:Comentario)-[:EN_PUBLICACION]->(p:Publicacion)
RETURN u.username AS usuario, c.contenido AS comentario, p.contenido AS publicacion;

// 10.6 Respuestas a comentarios
MATCH (c1:Comentario)-[:RESPONDE_A]->(c2:Comentario)
RETURN c1.contenido AS respuesta, c2.contenido AS comentario_padre;

// 10.7 Publicaciones con hashtags
MATCH (p:Publicacion)-[:TIENE_HASHTAG]->(h:Hashtag)
RETURN p.contenido AS publicacion, h.nombre AS hashtag;

// 10.8 Publicaciones por categoría
MATCH (p:Publicacion)-[:PERTENECE_A]->(cat:Categoria)
RETURN p.contenido AS publicacion, cat.nombre AS categoria;

// 10.9 Eventos y ciudad
MATCH (e:Evento)-[:OCURRE_EN]->(ci:Ciudad)
RETURN e.titulo AS evento, ci.nombre AS ciudad;

// 10.10 Usuarios que asisten a eventos
MATCH (u:Usuario)-[:ASISTE_A]->(e:Evento)
RETURN u.username AS usuario, e.titulo AS evento;

// 10.11 Usuarios y grupos
MATCH (u:Usuario)-[r:PERTENECE_A]->(g:Grupo)
RETURN u.username AS usuario, g.nombre AS grupo, r.rol_en_grupo AS rol;

// 10.12 Usuarios y ciudad donde viven
MATCH (u:Usuario)-[:VIVE_EN]->(ci:Ciudad)
RETURN u.username AS usuario, ci.nombre AS ciudad;