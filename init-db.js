'use strict';

const readline = require('node:readline');
const connection = require('./lib/connectMongoose');
const Anuncio = require('./models/Anuncio');  
const initData = require('./init-db-data.json');

main().catch(err => console.log('Hubo un error', err));

async function main() {

    await new Promise(resolve => connection.once('open', resolve))
  
    const borrar = await pregunta(
      'Estas seguro de que quieres borrar la base de datos y cargar datos iniciales?'
    )
    if (!borrar) {
      process.exit();
    }
  
    // inicializar la colección de anuncios
    await initAnuncios();
  
    connection.close();
  }
  
  async function initAnuncios() {
    // borrar todos los documentos de la colección de anuncios
    const deleted = await Anuncio.deleteMany();
    console.log(`Eliminados ${deleted.deletedCount} anuncios.`);
  
    // crear anuncios iniciales
    const inserted = await Anuncio.insertMany(initData.anuncios);
    console.log(`Creados ${inserted.length} anuncios.`);
  }
  
  function pregunta(texto) {
    return new Promise((resolve, reject) => {
      const ifc = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });
      ifc.question(texto, respuesta => {
        ifc.close();
        resolve(respuesta.toLowerCase() === 'si');
      })
    });
  }
  