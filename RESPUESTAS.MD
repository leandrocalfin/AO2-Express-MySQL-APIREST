# 1) Diseño básico de la API

**a) Rutas propuestas**

| Método HTTP | Ruta        | Acción                                         |
| ----------- | ----------- | ---------------------------------------------- |
| GET         | /libros     | para traer todos los libros registrados        |
| GET         | /libros/:id | para traer un libro especifico por su ID       |
| POST        | /libros     | para agregar un nuevo libro                    |
| PUT         | /libros/:id | para modificar la información de un libro existente |
| DELETE      | /libros/:id | Eliminar un libro de la base de datos          |

Estas rutas permiten implementar las operaciones básicas (ver, agregar, modificar y eliminar registros) necesarias para administrar los libros de la librería.

**b) Diferencia entre /libros y /libros/5**

/libros apunta a todos los libros juntos, si hacés un GET te devuelve la lista completa. En cambio /libros/5 apunta a un libro específico, el que tiene ID 5. Entonces dependiendo del método que uses sobre esa ruta podés ver, modificar o borrar solo ese registro sin tocar los demás.

**c) Datos almacenados para cada libro**

La tabla libros tiene los siguientes campos:

* id → identificador único del libro.
* titulo → nombre o título del libro.
* autor → autor del libro.
* precio → valor económico del libro.
* stock → cantidad disponible.

# 2) Express y Middleware

**a) ¿Para qué sirve Express?**

Básicamente Express es como una capa encima de Node.js que te facilita un montón la vida. Con Node puro tenés que hacer todo a mano, desde interpretar la URL hasta armar la respuesta. Express te da herramientas ya hechas para definir rutas, manejar los métodos GET, POST, PUT, DELETE, y conectar todo más ordenado. En el proyecto lo usamos para crear las rutas de la API y conectarlas con la base de datos MySQL.

**b) ¿Qué ventaja tiene Nodemon?**

Sin Nodemon, cada vez que cambiabas algo en el código tenías que ir a la terminal, frenar el servidor con Ctrl+C y volver a ejecutar `node app.js`. Con Nodemon eso pasa solo automáticamente. Detecta que guardaste un archivo y reinicia el servidor solo. En la práctica te ahorra muchísimo tiempo cuando estás probando cosas constantemente.

**c) ¿Qué es un middleware?**

Un middleware es código que se ejecuta en el medio, entre que llega la petición y antes de que el servidor responda. Imaginate una cadena: el cliente manda algo → pasan por los middlewares → llega a la ruta → se responde. Cada middleware puede hacer algo con esa petición: revisarla, modificarla, registrarla, o directamente cortarla si algo está mal.

**d) Dos middlewares del proyecto:**

- **express.json()** → Sin esto, si el cliente manda datos en formato JSON, el servidor los recibe pero no los entiende. Este middleware los convierte en un objeto JavaScript que ya podés usar directamente con `req.body`.

- **morgan** → Es básicamente un logger. Cada vez que llega una petición, morgan la imprime en la consola mostrando el método, la ruta y el código de respuesta. Cuando algo falla durante las pruebas, eso te ayuda a ver exactamente qué está pasando.

## 3) Base de Datos y Seguridad

**a) ¿Por qué es importante validar datos?**

Si no validás los datos antes de guardarlos, la base de datos se puede llenar de basura e inconsistencias. Por ejemplo, que alguien guarde un libro sin título, con precio negativo, o que mande un campo vacío. Después esos datos rotos te generan problemas en toda la aplicación porque confiás en que están bien y no están. La validación es básicamente un filtro antes de tocar la base de datos.

**b) Controles antes de insertar un libro:**

- Que el título y el autor no vengan vacíos
- Que el precio sea un número y sea mayor a cero
- Que el stock sea entero y no negativo
- Que los textos no superen cierta longitud
- Que todos los campos requeridos existan antes de ejecutar el INSERT

Si alguno de esos falla, devolvés un error al cliente antes de ni siquiera intentar guardar algo.

**c) ¿Qué pasa si no manejás errores de base de datos?**

En el mejor caso el servidor se cae y el usuario no entiende qué pasó. En el peor caso sigue corriendo pero con datos inconsistentes sin que nadie se dé cuenta. Sin manejo de errores también es muy difícil debuggear porque no sabés si falló la conexión, la consulta o qué. Lo mínimo es atrapar el error y devolver una respuesta clara.

**d)¿Qué riesgos puede tener construir consultas SQL concatenando texto manualmente?**

Si pegás los datos directamente en la consulta SQL alguien puede meter texto (SQL Injection) malicioso que cambia lo que hace la consulta. Por eso usamos los signos ? en vez de concatenar, así MySQL trata lo que manda el usuario como un dato y no como parte del código SQL.

## 4) Análisis de Código Generado por IA

**a)Identificar al menos 3 problemas o riesgos del código.**

Primer problema: está concatenando el título directo en el SQL, eso es SQL Injection puro. Cualquiera puede mandar cualquier cosa y romper la consulta.

Segundo Problema: no valida nada. Si el título viene vacío igual intenta insertarlo, y si req.body.titulo ni existe, el código explota sin avisar nada útil.

Tercer problema: no maneja errores. Si la consulta falla por lo que sea, el usuario igual recibe "Libro agregado" como si todo hubiera salido bien, lo cual es mentira.

**b)Explicar:qué podría fallar, qué faltaría validar y qué mejoraría.**

Podría fallar si se cae la conexión, si el usuario manda el campo vacío, o directamente si no manda nada. Faltaría verificar que el título exista y no esté vacío antes de tocar la base de datos. Mejoraría bastante si usara consultas con ? en vez de concatenar, y si controlara el error dentro del query en vez de ignorarlo.

**c)Proponer una versión mejorada o describir cómo la corregiría.**

Sacaría la concatenación y usaría parámetros, agregaría un if antes del query para verificar que los datos estén, y movería el res.send adentro del callback del query para que solo responda cuando realmente se insertó algo. También devolvería un status 400 o 500 según el caso en vez de siempre responder lo mismo.

