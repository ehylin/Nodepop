const express = require('express');
const router = express.Router();
const Anuncio = require('../../models/Anuncio');
const upload = require('../../lib/uploadConfigure');

/**
 * @openapi
 * /api/anuncios:
 *  get:
 *   description: Devuelve una lista de anuncios
 *   responses:
 *    200:
 *     description: Devuelve JSON
 */

router.get('/', async (req, res, next) => {


    try {

      const usuarioIdLogado = req.usuarioLogadoAPI;
      // filtros
    // http://127.0.0.1:3000/api/snuncios?name=Jones
    const filterByName = req.query.name;
    const filtreByAge = req.query.age;
    // paginación
    // http://127.0.0.1:3000/api/snuncios?skip=2&limit=2
    const skip = req.query.skip;
    const limit = req.query.limit;
    // ordenación
    // http://127.0.0.1:3000/api/anuncios?sort=-age%20name
    const sort = req.query.sort;
    // field selection
    // http://localhost:3000/api/anuncios?fields=name%20-_id%20address
    const fields = req.query.fields;

    const filtro = {};

    if (filterByName) {
      filtro.name = filterByName;
    }

    if (filtreByAge) {
      filtro.age = filtreByAge;
    }

    filtro.owner = usuarioIdLogado;

    const anuncios = await Anuncio.lista(filtro, skip, limit, sort, fields);

    res.json({ results: anuncios })
    } catch (err) {
      next(err);
    }
  });

  router.get('/:id', async (req, res, next) => {
    try {

      const id = req.params.id;

      const anuncio = await Anuncio.findById(id);

      res.json({ result: anuncio });
    } catch (err) {
        next(err);
    }
});


router.put('/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    const data = req.body;

    const anuncioActualizado = await Anuncio.findByIdAndUpdate(id, data, { new: true });

    res.json({ result: anuncioActualizado });

  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const anuncioData = req.body;
    const usuarioIdLogado = req.usuarioLogadoAPI;

    console.log(req.file);

    // creamos una instancia de snuncio en memoria
    const anuncio = new Anuncio(anuncioData);
    anuncio.avatar = req.file.filename;
    anuncio.owner = usuarioIdLogado;

    // la persistimos en la BD
    const anuncioGuardado = await anuncio.save();

    res.json({ result: anuncioGuardado });

  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
    try {
      const id = req.params.id;
  
      await Anuncio.deleteOne({ _id: id });
  
      res.redirect('/');
    } catch (err) {
      next(err);
    }
  })


  
  module.exports = router;