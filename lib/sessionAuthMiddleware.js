// modulo que exporta un middleware que controla si estamos logados o no

module.exports = (req, res, next) => {
    // si el cliente que hace la petición, no tiene en su sesión la variable usuarioLogado
    // le redirigimos al login porque no le conocemos
    if (!req.session.usuarioLogado) {
      res.redirect('/login');
      return;
    }
    next();
  }