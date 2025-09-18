const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { Rental } = require('../models/rental');

router.post('/', async (req, res) => {
  console.log('🚀 ~ req.body:', req.body);
  if (!req.body.customerId) return res.status(400).send('customerId not found');
  if (!req.body.movieId) return res.status(400).send('movieId not found');

  const rental = await Rental.findOne({
    'customer._id': req.body.customerId,
    'movie._id': req.body.movieId,
  });

  if (!rental) return res.status(404).send('Rental not found');

  res.status(401).send('Unauthorized');
});

module.exports = router;
