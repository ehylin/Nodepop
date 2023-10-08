const express = require('express');
const router = express.Router();
const Anuncio = require('../../models/Anuncio');

router.get('/apiv1/anuncios', async (req, res, next) => {
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
  
      res.json(anuncios);
    } catch (err) {
      next(err);
    }
  });
  
  module.exports = router;