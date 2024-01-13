var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const MongoStore = require('connect-mongo');
const session = require('express-session');
const swaggerMiddleware = require('./lib/swaggerMiddleware');
const basicAuthMiddleware = require('./lib/basicAuthMiddleware');
const sessionAuthMiddleware = require('./lib/sessionAuthMiddleware');
const jwtAuthMiddleware = require('./lib/jwtAuthMiddleware');
const i18n = require('./lib/i18nConfigure');
const FeaturesController = require('./controllers/FeaturesController');
const LangController = require('./controllers/LangController');
const LoginController = require('./controllers/LoginController');
const PrivadoController = require('./controllers/PrivadoController');
const AnunciosController = require('./controllers/AnunciossController');

require('./lib/connectMongoose');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// definimos una variable de vista que estará disponible
// en todos los render que hagamos
app.locals.title = 'NodeApp';

// middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false })); // parea el body en formato urlencoded
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// app.use('/pdfs', express.static(path.join(__dirname, 'd:/pdfs')));

// app.use((req, res, next) => {
//   console.log('Ha llegado una petición a', req.url);
//   next('zzz');
// });

const loginController = new LoginController();

/**
 * Rutas del API
 */
app.use('/api-doc', swaggerMiddleware);
app.post('/api/login', loginController.postJWT);
app.use('/api/anuncios', jwtAuthMiddleware, require('./routes/api/anuncios'));

/**
 * Rutas del website
 */
const featuresController = new FeaturesController();
const langController = new LangController();
const privadoController = new PrivadoController();
const anunciosController = new AnunciosController();

app.use(i18n.init);
app.use(session({
  name: 'nodeapp-session', // nombre de la cookie
  secret: 'as98987asd98ashiujkasas768tasdgyy',
  saveUninitialized: true, // Forces a session that is "uninitialized" to be saved to the store
  resave: false, // Forces the session to be saved back to the session store, even if the session was never modified during the request
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 2 // 2d - expiración de la sesión por inactividad
  },
  store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI})
}));
// hacemos que el objeto session esté disponible al renderizar las vistas
app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});
app.use('/',      require('./routes/index'));
app.use('/users', require('./routes/users'));
// app.use('/features', require('./routes/features'));
app.get('/features', featuresController.index);
app.get('/change-locale/:locale', langController.changeLocale);
app.get('/login', loginController.index);
app.post('/login', loginController.post);
app.get('/logout', loginController.logout);
// Zona privada del usuario
app.get('/privado', sessionAuthMiddleware, privadoController.index);
app.get('/anuncios-new', sessionAuthMiddleware, anunciosController.new);
app.post('/anuncios-new', sessionAuthMiddleware, anunciosController.postNewAnuncio);
app.get('/anuncios-delete/:anuncioId', sessionAuthMiddleware, anunciosController.deleteAnuncio)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {

  // comprobar si es un error de validación
  if (err.array) {
    const errorInfo = err.errors[0]; // err.array({ onlyFirstError: true })[0]
    console.log(errorInfo)
    err.message = `Error en ${errorInfo.location}, parámetro ${errorInfo.path} ${errorInfo.msg}`;
    err.status = 422;
  }

  res.status(err.status || 500);

  // si lo que ha fallado es una petición al API
  // responder con un error en formato JSON
  if (req.originalUrl.startsWith('/api/')) {
    res.json({ error: err.message });
    return;
  }

  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.render('error');
});

module.exports = app;
