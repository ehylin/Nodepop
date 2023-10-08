var express = require('express');
var router = express.Router();

/* GET home page. */

const Anuncio = require('../models/Anuncio');

router.get('/', async (req, res, next) => {
  try {
    const anuncios = await Anuncio.find();
    res.render('index', { title: 'Nodepop', anuncios });
  } catch (err) {
    next(err);
  }
});


module.exports = router;



