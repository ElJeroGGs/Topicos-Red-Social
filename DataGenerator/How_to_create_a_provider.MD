# Como crear un provider y un generador de datos para el proyecto

## Estructura de archivos
Todo lo respectivo al generador de datos se encuentra dentro del submódulo `DataGenerator`, con la siguiente estructura de archivos:
```shell
DataGenerator/
├── Output/                  # CSV generados
├── README.md                # Documentación del submódulo
├── requirements.txt         # Dependencias
└── src/
    ├── faker_core/          # Núcleo de Faker
    │   ├── faker_instance.py
    │   └── providers/
    │       ├── city_provider.py
    │       └── __init__.py
    ├── generators/          # Un generador por entidad
    │   ├── Ciudades.py
    │   └── __init__.py
    ├── main.py              # Orquestador principal
    └── writer/
        ├── csv_writer.py    # Escritura de CSV
        └── __init__.py
```
### Explicacion de carpetas y archivos
- `Output/`: Carpeta donde se guardarán los archivos CSV generados.
- `requirements.txt`: Archivo con las dependencias necesarias para ejecutar el generador de datos.
- `src/`: Carpeta principal del código fuente del generador de datos.
  - `faker_core/`: Contiene la instancia de Faker y los providers personalizados.
    - `faker_instance.py`: Configuración de la instancia de Faker.
    - `providers/`: Carpeta para los providers personalizados, como el `city_provider.py` que contiene el provider para generar ciudades.
  - `generators/`: Contiene un generador específico para cada entidad (Usuarios, Publicaciones, Grupos, Eventos, etc.) sirviendo como intermediario entre el núcleo de Faker y la escritura de los archivos CSV.
  - `main.py`: Archivo principal que orquesta la generación de datos y la escritura de los archivos CSV.
  - `writer/`: Contiene la lógica para escribir los datos generados en archivos CSV.

### Explicacion de flujo de generación de datos
```shell
main.py --> 
generators/Ciudades.py --> 
providers/city_provider.py --> 
faker_instance.py --> 
Faker --> 
city_provider.py --> 
generators/Ciudades.py --> 
main.py --> 
writer/csv_writer.py --> 
Output/Ciudades.csv
```
el archivo `main.py` orquesta el proceso de generación de datos, llamando a los generadores específicos para cada entidad. Cada generador utiliza los providers personalizados para generar datos realistas, y luego pasa esos datos al módulo de escritura para guardarlos en archivos CSV en la carpeta `Output/`.

### Como ejecutar el generador de datos
1. Clona el repositorio y navega a la carpeta `DataGenerator`.
2. crea un entorno virtual e instala las dependencias con `pip install -r requirements.txt`.
3. Ejecuta el generador de datos con el comando:
    ```bash
    python src/main.py
    ```
Esto generará los archivos CSV con los datos de ejemplo para cada entidad en la carpeta `Output/`.

## Como crear un nuevo provider
1. Crea un nuevo archivo Python dentro de la carpeta `src/faker_core/providers/
2. Define una nueva clase que herede de `BaseProvider` y agrega los métodos necesarios para generar los datos específicos de esa entidad.
3. Importa y registra el nuevo provider en la instancia de Faker en `faker_instance.py`.
4. Crea un nuevo generador en la carpeta `src/generators/` que utilice el nuevo provider para generar los datos y pasarlos al módulo de escritura.
5. Agrega la llamada al nuevo generador en `main.py` para que se ejecute al generar los datos.
6. Ejecuta el generador de datos para verificar que el nuevo provider y generador funcionen correctamente y que los datos se guarden en los archivos CSV correspondientes.

## Que es un provider
Un provider es una clase que hereda de `BaseProvider` de la biblioteca Faker y define métodos para generar datos específicos de una entidad. Por ejemplo, un `CityProvider`:
```python
from faker.providers import BaseProvider

class CityProvider(BaseProvider):

    mexico_cities = [...]  # Lista de ciudades mexicanas con su estado y país]

    us_cities = [...]  # Lista de ciudades estadounidenses con su estado y país]

    raw_cities = mexico_cities + us_cities # Combina ambas listas para tener una lista completa de ciudades

    cities = [
        {
            "internal_id:(Ciudad)": i,
            "nombre": city["city"],
            "estado": city["state"],
            "pais": city["country"]
        }
        for i, city in enumerate(raw_cities, start=1)
    ] # Crea una lista de diccionarios con la estructura necesaria para los nodos de ciudad, asignando un ID secuencial a cada ciudad
    
    def city_node(self):
        """Devuelve un nodo de ciudad."""
        return self.random_element(self.cities)

    def city_id(self):
        """Devuelve solo el ID de ciudad para relaciones."""
        city = self.random_element(self.cities)
        return city["internal_id:(Ciudad)"]
    
    def all_cities(self):
        """Devuelve la lista completa de ciudades."""
        return self.cities
    
    def city_count(self):
        """Devuelve el número total de ciudades disponibles."""
        return len(self.cities)
```
En este ejemplo, el `CityProvider` define métodos para generar nodos de ciudad, obtener solo el ID de ciudad para relaciones, obtener la lista completa de ciudades y contar el número total de ciudades disponibles. Estos métodos pueden ser utilizados por los generadores para crear datos realistas y consistentes para las ciudades en el proyecto.

Cada provider tiene un generador asociado que se encarga de llamar a los métodos del provider para generar los datos y luego pasarlos al módulo de escritura para guardarlos en archivos CSV. Esto permite mantener una separación clara entre la lógica de generación de datos y la lógica de escritura, facilitando la mantenibilidad y escalabilidad del código.

> Revisa los archivos `city_provider.py` y `Ciudades.py` para ver un ejemplo completo de cómo se implementa un provider y su generador asociado.

### Registrar el provider en Faker
Para que Faker pueda utilizar el nuevo provider, debes importarlo y registrarlo en la instancia de Faker en el archivo `faker_instance.py`:
```python
from faker import Faker

# Providers personalizados
from .providers.city_provider import CityProvider

# Configuración de Faker
seed = 42
locations = ["en_US", "es_MX",]

fake = Faker(locations)
Faker.seed(seed)

for factory in fake._factories:
    # Si realizas un provider personalizado, recuerda agregarlo a esta instancia de Faker para que se pueda usar en todo el proyecto.
    # fake.add_provider(CustomProvider)
    factory.add_provider(CityProvider)
```
En este ejemplo, se importa el `CityProvider` y se agrega a la instancia de Faker para que esté disponible en todo el proyecto. Esto permite que cualquier generador pueda utilizar los métodos definidos en el `CityProvider` para generar datos de ciudades de manera consistente y eficiente.

### Como usar el writer para guardar los datos en CSV
El módulo de escritura se encarga de tomar los datos generados por los generadores y guardarlos en archivos CSV en la carpeta `Output/`. Para usar el writer, simplemente importa la función correspondiente y pásale los datos generados:
```python
# Aqui iniciara la ejecucion del programa
from generators import Ciudades
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
```
El unico archivo encargado de llamar al writer es el `main.py`, los generadores solo se encargan de generar los datos y pasarlos al main para que este se encargue de escribirlos en los archivos CSV correspondientes. Esto mantiene una separación clara entre la lógica de generación de datos y la lógica de escritura, facilitando la mantenibilidad y escalabilidad del código.

```python
import csv

def write_csv(path, data, fieldnames, batch_size=10_000):
    with open(path, "w", newline="", encoding="utf-8", buffering=1024*1024) as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()

        batch = []

        for row in data:
            batch.append(row)

            if len(batch) == batch_size:
                writer.writerows(batch)
                batch.clear()

        if batch:
            writer.writerows(batch)
```
El `csv_writer.py` es una función que escribe los datos en un archivo CSV utilizando un enfoque de escritura por lotes para mejorar la eficiencia al manejar grandes volúmenes de datos. Toma el camino del archivo, los datos a escribir, los nombres de las columnas y el tamaño del lote como parámetros. Escribe los datos en el archivo CSV en lotes, lo que reduce la cantidad de operaciones de escritura y mejora el rendimiento al generar grandes archivos CSV.

Necesitas decirle al writer donde guardar los datos y la estructura de columnas que deseas en el archivo CSV. En el ejemplo del `main.py`, se le indica al writer que guarde los datos generados por el generador de ciudades en un archivo llamado `cities.csv` dentro de la carpeta `Output/`, con las columnas "internal_id:(Ciudad)", "nombre", "estado" y "pais".

## Porque separamos el provider del generador
Separar el provider del generador permite mantener una arquitectura más modular y escalable. El provider se encarga de definir cómo se generan los datos específicos de una entidad, mientras que el generador se encarga de orquestar la generación de esos datos y pasarlos al módulo de escritura. Esto permite que cada componente tenga una responsabilidad clara y facilita la mantenibilidad del código. Si en el futuro se necesita cambiar la forma en que se generan los datos de una entidad, solo se tendría que modificar el provider correspondiente sin afectar la lógica de generación o escritura, lo que reduce el riesgo de introducir errores y mejora la eficiencia del desarrollo.