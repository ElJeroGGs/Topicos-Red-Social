# Generador de datos Iniciales
Esta parte del proyecto se encarga de generar los datos iniciales para la base de datos de grafos.
Objetivo: 10 millones de nodos en total, con sus respectivas relaciones.

# Herramientas y Tecnologías
- Python: Para escribir los scripts de generación de datos.
- Faker: Para generar datos realistas de usuarios, ciudades, etc.
- csv: Para exportar los datos generados a archivos CSV, que luego se importarán a la base de datos de grafos.

## Uso de Git
Siempre usar la rama `DataInsert` para trabajar en la generación de datos. Crea ramas de trabajo a partir de `DataInsert` siguiendo el flujo de trabajo establecido en el archivo Contributing.md y cuando tu tarea este hecha solicitar un Pull Request a `DataInsert` para revisión y merge.

# Reglas para la Generación de Datos
- Los datos deben ser lo más realistas posible, utilizando Faker para nombres, ciudades, etc.
- Siempre se generaran csv para aumentar la eficiencia al crear e importar los datos a la base de datos de grafos.
- Cada tipo de nodo y relación debe tener su propio script de generación, siguiendo el orden de creación de datos establecido más abajo.
- Si algun dato no puede ser generado usando Faker, se pueden usar listas predefinidas pero creen un provider para Faker para mantener la eficiencia y la consistencia en la generación de datos.
- Utilicen las regiones de México y Estados Unidos.
- Las relaciones solo se generaran una vez que los nodos involucrados hayan sido generados, para evitar errores de integridad referencial.
- Siempre usar id simples y secuenciales para los nodos, para facilitar la creación de relaciones y la importación a la base de datos de grafos.

# Distribución de Datos
- Usuarios: 3 millones
- Ciudades: 82
- Categorias: 100
- Hashtags: 500
- Comentarios: 4 millones
- Publicaciones: 3 millones
- Grupos: 1000
- Eventos: 500
> Son poco mas de 10 millones de nodos

# Orden de Creación de Datos
- 1️⃣ Usuarios
- 2️⃣ Ciudades
- 3️⃣ Categorias
- 4️⃣ Hashtags
- 5️⃣ Comentarios
- 6️⃣ Publicaciones
- 7️⃣ Grupos
- 8️⃣ Eventos

# Estructura de los CSV
Cada tipo de nodo y relación tendrá su propio archivo CSV con la siguiente estructura:
## Nodos
- Usuarios:
    ```csv
    internal_id:ID(User),username,nombre,apellido,correo,password_hash,bio,fecha_registro,fecha_nacimiento,foto_perfil_url,status
    0,juan_dev,Juan,Perez,juan@mail.com,hash1,"Programador",2024-01-01,1995-02-10,url1,activo
    1,maria_art,Maria,Gomez,maria@mail.com,hash2,"Artista",2024-01-02,1998-05-03,url2,activo
    2,carlos_music,Carlos,Lopez,carlos@mail.com,hash3,"Musico",2024-01-03,1993-08-12,url3,activo
    ```
- Ciudades:
    ```csv
    internal_id:ID(City),nombre,estado,pais
    0,CDMX,CDMX,Mexico
    1,Guadalajara,Jalisco,Mexico
    2,Monterrey,Nuevo Leon,Mexico
    ```
- Categorias:
    ```csv
    internal_id:ID(Category),nombre,descripcion
    0,tecnologia,"contenido tech"
    1,entretenimiento,"contenido de ocio"
    2,arte,"contenido de arte"
    ```
- Hashtags:
    ```csv
    internal_id:ID(Hashtag),nombre,descripcion,fecha_creacion
    0,tech,"tecnologia",2024-01-01
    1,music,"musica",2024-01-01
    2,art,"arte",2024-01-01
    ```
- Comentarios:
    ```csv
    internal_id:ID(Comment),contenido,fecha_comentario,status
    0,"Buen post!",2024-02-02,activo
    1,"Excelente!",2024-02-03,activo
    2,"Me gusta!",2024-02-04,activo
    ```
- Publicaciones:
    ```csv
    internal_id:ID(Post),contenido,tipo_contenido,visibilidad,fecha_publicacion,ubicacion_texto,status
    0,"Hola mundo","texto","publico",2024-02-01,"CDMX","activo"
    1,"Mi primer concierto","imagen","publico",2024-02-02,"Guadalajara","activo"
    2,"Nuevo proyecto de arte","video","publico",2024-02-03,"Monterrey","activo"
    ```
- Grupos:
    ```csv
    internal_id:ID(Group),nombre,descripcion,privacidad,fecha_creacion,status
    0,"Desarrolladores","Grupo de programacion",publico,2024-01-01,activo
    1,"Artistas","Grupo de arte",publico,2024-01-02,activo
    2,"Musicos","Grupo de musica",publico,2024-01-03,activo
    ```
- Eventos:
    ```csv
    internal_id:ID(Event),titulo,descripcion,fecha_inicio,fecha_fin,modalidad,lugar,capacidad,status
    0,"Conferencia Tech","Evento tecnologia",2024-05-01,2024-05-02,presencial,"CDMX",200,activo
    1,"Festival de Musica","Evento musica",2024-06-01,2024-06-02,presencial,"Guadalajara",500,activo
    ```

## Relaciones
Cada relación tendrá un archivo CSV con la siguiente estructura:
```csv
:START_ID(Nodo),:END_ID(Nodo),fecha_relacion,mas_info_si_es_necesario
0,1,2024-02-01,"mas info si es necesario"
```
- `(Usuario)-[:SIGUE]->(Usuario)`
- `(Usuario)-[:BLOQUEA]->(Usuario)`
- `(Usuario)-[:PERTENECE_A]->(GRUPO)`
- `(Usuario)-[:ADMINISTRA]->(GRUPO)`
- `(Usuario)-[:GUARDA]->(EVENTO)`
- `(Usuario)-[:ASISTIRA]->(EVENTO)`
- `(Usuario)-[:ORGANIZA]->(EVENTO)`
- `(USUARIO)-[:COMENTA]->(COMENTARIO)`
- `(USUARIO)-[:REACCIONA]->(COMENTARIO)`
- `(USUARIO)-[:PUBLICA]->(PUBLICACION)`
- `(USUARIO)-[:REACCIONA]->(PUBLICACION)`
- `(USUARIO)-[:COMPARTE]->(PUBLICACION)`
- `(USUARIO)-[:GUARDA]->(PUBLICACION)`
- `(USUARIO)-[:ETIQUETA]->(PUBLICACION)`
- `(USUARIO)-[:VIVE_EN]->(CIUDAD)`
- `(USUARIO)-[:NACIO_EN]->(CIUDAD)`
- `(EVENTO)-[:OCURRE_EN]->(CIUDAD)`
- `(COMENTARIO)-[:RESPUESTA_A]->(PUBLICACION)`
- `(COMENTARIO)-[:RESPUESTA_A]->(COMENTARIO)`
- `(PUBLICACION)-[:TIENE]->(HASHTAG)`
- `(PUBLICACION)-[:UBICADO_EN]->(CIUDAD)`
- `(HASHTAG)-[:ASOCIADO_A]->(CATEGORIA)`
- `(CATEGORIA)-[:SUBCATEGORIA_DE]->(CATEGORIA)`

---

# Como ejecutar
1. Clonar el repositorio y navegar a la carpeta `DataGenerator`.
2. Crear un entorno virtual e instalar las dependencias con `pip install -r requirements.txt`
3. Ejecutar
   ```bash
   python src/main.py
   ```
---

> IMPORTANTE: Si hay dudas sobre la información o tarea a realizar, pregunten a los PMs antes de generar datos o relaciones, para evitar retrabajos y pérdida de tiempo.