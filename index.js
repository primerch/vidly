require('dotenv').config();

const mongoose = require('mongoose');
const express = require('express');
const app = express();
const genres = require('./routes/genres');
const customers = require('./routes/customers');

mongoose
  .connect('mongodb://localhost/vidly')
  .then(() => console.log('Connected To MongoDB...'))
  .catch((err) => console.log('Could Not Connect To MongoDB...'));

app.use(express.json());
app.use('/api/genres', genres);
app.use('api/customers', customers);

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Listening on port: ${port}`));
