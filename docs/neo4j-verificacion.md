# Verificacion de datos en Neo4j

Estas consultas sirven para confirmar que lo que se escribe desde Jerobook quedo guardado en Neo4j.

## Ultimas publicaciones

```cypher
MATCH (u:Usuario)-[:PUBLICA]->(p:Publicacion)
OPTIONAL MATCH (p)-[:UBICADO_EN]->(c:Ciudad)
OPTIONAL MATCH (p)-[:TIENE]->(h:Hashtag)
RETURN
  p.id AS id,
  p.contenido AS contenido,
  u.username AS autor,
  c.nombre AS ciudad,
  collect(DISTINCT h.nombre) AS hashtags,
  p.fecha_creacion AS fecha
ORDER BY p.fecha_creacion DESC
LIMIT 20;
```

## Buscar una publicacion por texto

```cypher
MATCH (u:Usuario)-[:PUBLICA]->(p:Publicacion)
WHERE toLower(p.contenido) CONTAINS toLower("cdmx")
OPTIONAL MATCH (p)-[:UBICADO_EN]->(c:Ciudad)
OPTIONAL MATCH (p)-[:TIENE]->(h:Hashtag)
RETURN p.contenido, u.username, c.nombre, collect(DISTINCT h.nombre) AS hashtags;
```

## Buscar publicaciones por ciudad

```cypher
MATCH (u:Usuario)-[:PUBLICA]->(p:Publicacion)-[:UBICADO_EN]->(c:Ciudad)
WHERE c.nombre = "Ciudad de México"
OPTIONAL MATCH (p)-[:TIENE]->(h:Hashtag)
RETURN p.contenido, u.username, c.nombre, collect(DISTINCT h.nombre) AS hashtags;
```

## Buscar publicaciones por hashtag

```cypher
MATCH (u:Usuario)-[:PUBLICA]->(p:Publicacion)-[:TIENE]->(h:Hashtag)
WHERE h.nombre = "uaemex"
OPTIONAL MATCH (p)-[:UBICADO_EN]->(c:Ciudad)
RETURN p.contenido, u.username, c.nombre, h.nombre;
```

## Publicaciones de un usuario especifico

```cypher
MATCH (u:Usuario {username: "TU_USERNAME"})-[:PUBLICA]->(p:Publicacion)
OPTIONAL MATCH (p)-[:UBICADO_EN]->(c:Ciudad)
RETURN u.username, p.contenido, c.nombre, p.fecha_creacion
ORDER BY p.fecha_creacion DESC;
```

## Contar relaciones del grafo

```cypher
MATCH ()-[r]->()
RETURN type(r) AS relacion, count(*) AS total
ORDER BY relacion;
```

## Comentarios guardados

```cypher
MATCH (u:Usuario)-[:COMENTA]->(c:Comentario)-[:RESPUESTA_A]->(p:Publicacion)
RETURN u.username, c.contenido, p.contenido
ORDER BY c.fecha_creacion DESC
LIMIT 20;
```
