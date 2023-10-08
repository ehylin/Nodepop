const express = require('express');
const router = express.Router();
const Anuncio = require('../../models/Anuncio');

router.get('/anuncios', async (req, res, next) => {
    try {
      const filters = {};
  
      if (req.query.tag) {
        filters.tags = req.query.tag;
      }
  
      if (req.query.venta) {
        filters.venta = req.query.venta === 'true';
      }
  
      if (req.query.nombre) {
        filters.nombre = new RegExp('^' + req.query.nombre, "i");
      }
  
      if (req.query.precio) {
        const range = req.query.precio.split('-');
        filters.precio = {};
  
        if (range[0]) {
          filters.precio.$gte = range[0];
        }
        if (range[1]) {
          filters.precio.$lte = range[1];
        }
      }
  
      const anuncios = await Anuncio.find(filters).limit(Number(req.query.limit)).skip(Number(req.query.start)).sort(req.query.sort);
  
      res.render('index', { title: 'Anuncios', anuncios });
    } catch (err) {
      next(err);
    }
  });

  router.get('/tags', async (req, res, next) => {
    try {

        const tags = await Anuncio.distinct('tags');

        res.render('index', { title: 'Tags', tags });
    } catch (err) {
        next(err);
    }
});

router.post('/anuncios', async (req, res, next) => {
    try {
        const { nombre, tags, precio, venta, foto } = req.body;
        
        if (!nombre || !tags || !precio || typeof venta !== 'boolean' || !foto) {
            return res.status(400).json({ error: 'Datos de entrada no válidos' });
        }

        const anuncio = new Anuncio({ nombre, tags, precio, venta, foto });
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