const mongoose = require('mongoose');

const URI = process.env.MONGO_URI_WAIVIO
  ? process.env.MONGO_URI_WAIVIO
  : 'mongodb://localhost:27017/waivio';

const currenciesDb = mongoose.createConnection(URI);
currenciesDb.on('error', console.error.bind(console, 'connection error:'));
currenciesDb.once('open', () => {
  console.log('waivio connected');
});

currenciesDb.on('close', () => console.log('closed waivio'));

module.exports = currenciesDb;
