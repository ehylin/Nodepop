const mongoose = require('mongoose');

const anuncioSchema = new mongoose.Schema({
    nombre: String,
    venta: Boolean,
    precio: Number,
    foto: String,
    tags: [String]
});

const Anuncio = mongoose.model('Anuncio', anuncioSchema);

anuncioSchema.statics.lista = function(filtro, skip, limit, sort, fields) {
    const query = Anuncio.find(filtro); // devuelve un objeto de tipo query que es un thenable
    query.skip(skip);
    query.limit(limit);
    query.sort(sort);
    query.select(fields);
    return query.exec();
  }

  anuncioSchema.methods.saluda = function() {
    console.log('Hola, soy el anuncio ' + this.name);
  }
  

  const Anuncio = mongoose.model('Anuncio', anuncioSchema);


module.exports = Anuncio;

