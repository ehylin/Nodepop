const { Anuncio, Usuario } = require('../models');
const createError = require('http-errors');

class PrivadoController {
  async index(req, res, next) {

    try {
      // obtener el id del usuario de la sesión
      const usuarioId = req.session.usuarioLogado;

      // buscar el usuario en la BD
      const usuario = await Usuario.findById(usuarioId);

      if (!usuario) {
        next(createError(500, 'usuario no encontrado'))
        return;
      }

      // cargar lista de anuncio que pertenecen al usuario
      const anuncios = await Anuncio.find({ owner: usuarioId });

      res.render('privado', {
        email: usuario.email,
        anuncios
      });

    } catch (err) {
      next(err);
    }
  }
}

module.exports = PrivadoController;