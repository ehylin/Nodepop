var createError = require('http-errors');
const Anuncio = require('../models/Anuncio');

class AnuncioController {
  new(req, res, next) {
    res.render('anuncios-new');
  }

  async postNewAnuncio(req, res, next) {
    try {
      const usuarioId = req.session.usuarioLogado;
      const { name, age } = req.body;

      const anuncio = new Anuncio({
        name,
        age,
        owner: usuarioId
      });
      await anuncio.save();

      res.redirect('/privado');

    } catch (error) {
      next(error);
    }
  }

  async deleteAnuncio(req, res, next) {
    try {
      const usuarioId = req.session.usuarioLogado;
      const anuncioId = req.params.anuncioId;

      const anuncio = await Anuncio.findOne({ _id: anuncioId });

      if (!anuncio) {
        console.warn(`WARNING - el usuario ${usuarioId} intentó eliminar un anuncio inexistente (${anuncioId})`);
        next(createError(404, 'Not found'));
        return;
      }

     
      if (anuncio.owner.toString() !== usuarioId) {
        console.warn(`WARNING - el usuario ${usuarioId} intentó eliminar un anuncio (${anuncioId}) propiedad de otro usuario (${anuncio.owner})`);
        next(createError(401, 'No autorizado'));
        return;
      }

      await Anuncio.deleteOne({ _id: anuncioId });

      res.redirect('/privado');

    } catch (error) {
      next(error);
    }
  }
}

module.exports = AnuncioController;