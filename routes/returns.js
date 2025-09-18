const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

router.post('/', (req, res) => {
  if (!req.body.customerId) return res.status(400).send('customerId not found');
  if (!req.body.movieId) return res.status(400).send('movieId not found');

  res.status(401).send('Unauthorized');
});

module.exports = router;
