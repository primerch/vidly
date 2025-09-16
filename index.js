require('dotenv').config();

const winston = require('winston');
require('winston-mongodb');
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const movies = require('./routes/movies');
const rentals = require('./routes/rentals');
const users = require('./routes/users');
const auth = require('./routes/auth');
const error = require('./middleware/error');

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

app.use(express.json());
app.use('/api/genres', genres);
app.use('/api/customers', customers);
app.use('/api/movies', movies);
app.use('/api/rentals', rentals);
app.use('/api/users', users);
app.use('/api/auth', auth);
app.use(error);

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Listening on port: ${port}`));
