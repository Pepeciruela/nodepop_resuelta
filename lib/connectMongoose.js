'use strict';

const mongoose = require('mongoose');

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

mongoose.connection.on('error', function (err) {
  console.error('mongodb connection error:', err);
  process.exit(1);
});

mongoose.connection.once('open', function () {
  console.info('Connected to mongodb.');
});

const connectionPromise = mongoose.connect('mongodb://localhost/nodepop', {
  useUnifiedTopology: true
});

// exportamos la promesa de la conexión (https://mongoosejs.com/docs/connections.html)
module.exports = connectionPromise;
