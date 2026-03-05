🌐 Proyecto: Red Social Orientada a Grafos

Materia: Tópicos de Tecnologías de Datos (2026a)

Tema: Bases de Datos Orientadas a Grafos (Graph Database)

Fecha de Primera Entrega: 21 de Marzo de 2026

📖 Descripción del Proyecto

Este repositorio contiene el diseño, modelado y generación de datos para una aplicación de Red Social basada en una arquitectura de base de datos orientada a grafos. En fases posteriores, se desarrollará el Backend (GraphQL) y Frontend de la aplicación, así como dashboards de Business Intelligence (Metabase).

El objetivo principal de esta primera etapa es diseñar el modelo de datos (lógico y físico) y poblar la base de datos con al menos 10 millones de registros generados mediante lógica probabilística propia, demostrando el poder de las bases de datos de grafos para manejar relaciones complejas.

🗂️ Estructura del Modelo de Datos (Grafos)

La red social se compone de un mínimo de 8 nodos principales y sus respectivas relaciones:

Nodos:

Usuario

Publicación (Post)

Comentario

Grupo

Hashtag

Evento

Ciudad

Categoría

Relaciones Principales:

(Usuario) -[:SIGUE]-> (Usuario)

(Usuario) -[:PUBLICA]-> (Publicación)

(Usuario) -[:COMENTA]-> (Comentario)

(Publicación) -[:TIENE]-> (Hashtag)

(Usuario) -[:PERTENECE]-> (Grupo)

(Evento) -[:OCURRE_EN]-> (Ciudad)

📁 Estructura del Repositorio

Para mantener el orden, el repositorio se divide en los siguientes directorios:

/modelos: Contiene diagramas y documentación del modelo lógico y físico (PDFs, imágenes, diagramas de flechas).

/scripts: Código fuente (Python/Node.js) del generador de datos probabilístico.

/queries: Archivos .cypher o .sql con las sentencias de inserción (INSERT) y pruebas de validación de los 10 millones de registros.

/docs: Materiales de la exposición de la primera entrega (Presentación sobre Graph Databases).

/infra: Archivos de configuración de infraestructura (ej. docker-compose.yml para levantar la BD).

🚀 Instrucciones de Ejecución (Fase 1)

Nota: Estas instrucciones se actualizarán conforme el equipo de Infraestructura y Backend definan las tecnologías exactas.

Levantar la Base de Datos:

# Ejemplo hipotético usando Docker
cd infra
docker-compose up -d


Ejecutar el script generador de datos:

# Ir a la carpeta de scripts e instalar dependencias
cd scripts
# Ejecutar el generador
python generador_datos.py


Poblar la Base de Datos:
Importar los archivos generados en la carpeta /queries hacia el motor de base de datos utilizando la consola o interfaz del DBMS.

👥 Equipo de Trabajo

Este proyecto es desarrollado por un equipo multidisciplinario. Nota: Todos los miembros cuentan con un rol primario y un rol secundario para garantizar el éxito de los entregables.

Project Managers: [Nombre 1], Lalo [Tus Apellidos]

Database Administrators (DBA): [Nombre 3], [Nombre 4], [Nombre 5], [Nombre 6]

Backend Developers: [Nombre 7], [Nombre 8], [Nombre 9]

Frontend Developers: [Nombre 10], [Nombre 11], [Nombre 12]

📄 Licencia

Este proyecto se distribuye bajo la licencia MIT. Siéntete libre de utilizar, modificar y distribuir este código para fines educativos o de portafolio.

Documento generado para fines académicos. Prohibido el uso de utilerías de internet para la generación de la data falsa de acuerdo con las reglas de evaluación.
