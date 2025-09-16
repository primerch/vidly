require('dotenv').config();

const winston = require('winston');
require('winston-mongodb');
const mongoose = require('mongoose');
const express = require('express');
const app = express();

require('./startup/routes')(app);

winston.add(new winston.transports.File({ filename: 'logfile.log' }));
winston.add(
  new winston.transports.MongoDB({
    db: 'mongodb://localhost/vidly',
    level: 'error',
  })
);

winston.exceptions.handle(
  // logs uncaught exceptions
  new winston.transports.File({ filename: 'exceptions.log' }),
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(), // adds colors to console output
      winston.format.simple() // human-readable format
    ),
  })
);

winston.rejections.handle(
  // logs unhandled promise rejections
  new winston.transports.File({ filename: 'rejections.log' }),
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    ),
  })
);

// const p = Promise.reject(new Error('Something failed miserabley!'));
// p.then(() => console.log('Done'));
// throw new Error('Something failed during startup.'); // uncaught exception

if (!process.env.JWT_SECRET) {
  console.error('FATAL ERROR: jstPrivateKey is not defined.');
  process.exit(1);
}

mongoose
  .connect('mongodb://localhost/vidly')
  .then(() => console.log('Connected To MongoDB...'))
  .catch((err) => console.log('Could Not Connect To MongoDB...'));

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Listening on port: ${port}`));
