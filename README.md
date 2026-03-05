# 🌐 Proyecto: Red Social Orientada a Grafos

Materia: Tópicos de Tecnologías de Datos (2026a)

Tema: Bases de Datos Orientadas a Grafos (Graph Database)

Fecha de Primera Entrega: 21 de Marzo de 2026

# 📖 Descripción del Proyecto

Este repositorio contiene el diseño, modelado y generación de datos para una aplicación de Red Social basada en una arquitectura de base de datos orientada a grafos. En fases posteriores, se desarrollará el Backend (GraphQL) y Frontend de la aplicación, así como dashboards de Business Intelligence (Metabase).

El objetivo principal de esta primera etapa es diseñar el modelo de datos (lógico y físico) y poblar la base de datos con al menos 10 millones de registros generados mediante lógica probabilística propia, demostrando el poder de las bases de datos de grafos para manejar relaciones complejas.

# 🗂️ Estructura del Modelo de Datos (Grafos)

La red social se compone de un mínimo de 8 nodos principales y sus respectivas relaciones:

Nodos:

1. Usuario

2. Publicación (Post)

3. Comentario

4. Grupo

5. Hashtag

6. Evento

7. Ciudad

8. Categoría

Relaciones Principales:

* (Usuario) -[:SIGUE]-> (Usuario)

* (Usuario) -[:PUBLICA]-> (Publicación)

* (Usuario) -[:COMENTA]-> (Comentario)

* (Publicación) -[:TIENE]-> (Hashtag)

* (Usuario) -[:PERTENECE]-> (Grupo)

* (Evento) -[:OCURRE_EN]-> (Ciudad)

# 📁 Estructura del Repositorio

Para mantener el orden, el repositorio se divide en los siguientes directorios:

* /modelos: Contiene diagramas y documentación del modelo lógico y físico (PDFs, imágenes, diagramas de flechas).

* /scripts: Código fuente (Python/Node.js) del generador de datos probabilístico.

* /queries: Archivos .cypher o .sql con las sentencias de inserción (INSERT) y pruebas de validación de los 10 millones de registros.

* /docs: Materiales de la exposición de la primera entrega (Presentación sobre Graph Databases).

* /infra: Archivos de configuración de infraestructura (ej. docker-compose.yml para levantar la BD).

# 🚀 Instrucciones de Ejecución (Fase 1)

Nota: Estas instrucciones se actualizarán conforme el equipo de Infraestructura y Backend definan las tecnologías exactas.

# 📄 Licencia

Este proyecto se distribuye bajo la licencia MIT. Siéntete libre de utilizar, modificar y distribuir este código para fines educativos o de portafolio.

Documento generado para fines académicos. Prohibido el uso de utilerías de internet para la generación de la data falsa de acuerdo con las reglas de evaluación.
