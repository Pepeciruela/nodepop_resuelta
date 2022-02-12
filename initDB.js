'use strict';

const { askUser } = require('./lib/utils');
const { mongoose, connectMongoose, Anuncio } = require('./models');

main().catch(err => console.error('Error!', err));

async function main() {
  
  // Si buscáis en la doc de mongoose (https://mongoosejs.com/docs/connections.html),
  // veréis que mongoose.connect devuelve una promesa que podemos exportar en connectMongoose
  // Espero a que se conecte la BD (para que los mensajes salgan en orden)
  await connectMongoose; 

  const answer = await askUser('Are you sure you want to empty DB? (no) ');
  if (answer.toLowerCase() !== 'yes') {
    console.log('DB install aborted! nothing has been done');
    return process.exit(0);
  }      
  // Inicializar nuestros modelos
  await initAnuncios('./anuncios.json');

  mongoose.connection.close();
  console.log('\nFinalizado.');
}

async function initAnuncios(fichero) {

  const { deletedCount } = await Anuncio.deleteMany();
  console.log(`\nBorrados ${deletedCount} anuncios.`);

  console.log('\nCargando ' + fichero + '...');
  const numLoaded = await Anuncio.cargaJson(fichero);
  console.log(`Se han cargado ${numLoaded} anuncios.`);

  return numLoaded;

}
