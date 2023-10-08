## Nodepop creada con Node Express Mongodb

## Características

- Lista de anuncios con paginación, filtros y ordenamiento.
- Creación de anuncios.
- Visualización de imágenes asociadas a anuncios.

## Configuración inicial

1. Clona este repositorio:

https://github.com/ehylin/Nodepop/tree/main

2. Instala las dependencias:

npm install

Review database connection on /lib/connectMongoose.js (see "Start a MongoDB Server in MacOS or Linux")

Load initial data:

```sh
# this command deletes all the data in the database and create default data
$ npm run init-db
```

3. Ejecuta el servidor:

In production:

```sh
npm start
```

In development:

```sh
npm run dev
```

La aplicación se ejecutará en `http://localhost:3000`.

## Start a MongoDB Server in MacOS or Linux

From the folder of the server:

```sh
./bin/mongod --dbpath ./data
```

## Cómo usar

### Frontend:

- Visita `http://localhost:3000` para acceder a la página principal y - - - visualizar la lista de anuncios. Puedes aplicar filtros directamente desde la URL.

Realiza solicitudes HTTP a los diferentes endpoints disponibles para interactuar con la API.

## Endpoints

- `GET /api/anuncios`: Retorna una lista de anuncios.
- `GET /api/tags`: Obtiene la lista de tags existentes.
- `POST /api/anuncios`: Crea un nuevo anuncio.

## Filtros y parámetros

- `tag`: Filtra anuncios por tag.
- `venta`: Filtra por tipo de anuncio (true para venta, false para búsqueda).
- `precio`: Establece un rango de precio (por ejemplo, `10-50`).
- `nombre`: Busca anuncios por nombre de artículo.
- Otros parámetros: `start`, `limit`, `sort`.

### GET /api/anuncios

```json
{
  "results": [
    {
      "_id": "5f7efc7b92ca8700170d9d46",
      "nombre": "Bicicleta",
      "venta": true,
      "precio": 230.15,
      "foto": "bici.jpg",
      "tags": ["lifestyle", "motor"]
    }
  ]
}
```

## Contacto

Si tienes preguntas o sugerencias, puedes contactar al desarrollador principal a través de [https://github.com/ehylin](https://github.com/ehylin).

---

## Aplicacion creada para practica keepcoding Fullstack

© 2023 Nodepop Team
