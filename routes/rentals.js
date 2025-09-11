const express = require('express');
const z = require('zod');
const { Rental, validate } = require('../models/rental');
const { Customer } = require('../models/customer');
const { Movie } = require('../models/movie');
const router = express.Router();

router.get('/', async (req, res) => {
  const result = await Rental.find();
  res.status(200).send(result);
});

router.get('/:id', async (req, res) => {
  const rental = Rental.findById(req.params.id);
  if (!rental) return res.status(404).send('cannot find the rental ID');
});

router.post('/', async (req, res) => {
  try {
    const validatedData = validate(req.body);

    const customer = await Customer.findById(validatedData.customerId);

    if (!customer) return res.status(400).send('Cannot find the customer');

    const movie = await Movie.findById(validatedData.movieId);
    if (!movie) return res.status(400).send('Cannot find the movie');

    if (movie.numberInStock === 0)
      return res.status(400).send('Movie not in stock.');

    const rental = new Rental({
      customer: {
        _id: customer._id,
        name: customer.name,
        isGold: customer.isGold,
        phone: customer.phone,
      },
      movie: {
        _id: movie._id,
        title: movie.title,
        dailyRentalRate: movie.dailyRentalRate,
      },
    });

    const result = await rental.save();

    movie.numberInStock--;
    movie.save();

    res.status(201).send(result);
  } catch (err) {
    console.log('🚀 ~ err:', err);
    if (err instanceof z.ZodError) {
      return res
        .status(400)
        .send(err.issues.map((issue) => issue.message).join('\n'));
    }
    return res.status(500).send('An unexpected Error Occurred');
  }
});

module.exports = router;
