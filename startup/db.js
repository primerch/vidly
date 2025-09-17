const winston = require('winston');
const mongoose = require('mongoose');

module.exports = function () {
  const db = process.env.NODE_ENV === 'test' ? process.env.MONGO_URL : 'mongodb://localhost/vidly';
  mongoose.connect(db).then(() => winston.info(`Connected To ${db}...`));
};
