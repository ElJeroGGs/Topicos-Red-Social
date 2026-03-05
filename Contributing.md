# 🛠️ Guía de Contribución y Flujo de Trabajo (Git)

Bienvenido al repositorio de la Red Social Orientada a Grafos. Al ser un equipo de 12 personas, es estrictamente necesario seguir este flujo de trabajo para evitar pérdida de código y conflictos de integración.

# 🌳 Estructura de Ramas

Nunca haremos commits directos a main ni a develop.

* main: Entregables finales evaluables. (Protegida)

* develop: Rama principal de integración y pruebas. (Protegida)

* Ramas de trabajo: Se crean a partir de develop usando prefijos.

Prefijos permitidos para tus ramas:

* feat/: Para código nuevo (ej. scripts en Python, queries de inserción).

* docs/: Para documentación (ej. imágenes de modelos, la presentación, el readme).

* fix/: Para arreglar errores en el código o modelos ya existentes.

* infra/: Para archivos de base de datos, Docker, etc.

# 🚀 Flujo de Trabajo Diario (Paso a Paso)

Cada vez que vayas a trabajar en una tarea (Issue) asignada a ti por los PMs, sigue estos pasos en tu terminal:

1. Actualiza tu entorno local

Siempre asegúrate de tener la última versión de la rama de integración:

git checkout develop
git pull origin develop


2. Crea tu rama de trabajo

Crea una rama descriptiva usando los prefijos mencionados. (Añade el número de Issue si lo tiene, ej. #T6).

git checkout -b feat/T6-generador-usuarios


3. Trabaja y haz Commits

Guarda tus cambios de forma descriptiva.

git add .
git commit -m "feat: agrega logica probabilistica para generar usuarios"


4. Sube tu rama a GitHub

git push origin feat/T6-generador-usuarios


5. Crea un Pull Request (PR)

Ve a GitHub.

Te aparecerá un botón verde que dice "Compare & pull request". Haz clic ahí.

Asegúrate de que la rama base (base) sea develop y la tuya sea la de comparación (compare).

Agrega a un compañero (o a un PM) en la sección Reviewers para que revise tu trabajo.

Una vez aprobado, el PM hará el Merge a develop.

# ⚠️ Reglas de Oro

NO HAGAS MERGE TÚ MISMO. Los PMs son los encargados de integrar las ramas una vez que el código y/o documentos han sido revisados.

Comunica en el grupo de trabajo cuando levantes un PR para que alguien te lo revise rápidamente.

Si el script pesa demasiado o genera archivos CSV/SQL de más de 50MB, agrégalos al archivo .gitignore. ¡No subas los archivos de 10 millones de registros a GitHub directamente, solo sube el código que los genera!
