const express = require('express');
const z = require('zod');
const { Rental, validate } = require('../models/rental');
const { Customer } = require('../models/customer');
const { Movie } = require('../models/movie');
const { default: mongoose } = require('mongoose');
const router = express.Router();

router.get('/', async (req, res) => {
  const result = await Rental.find();
  res.status(200).send(result);
});

router.get('/:id', async (req, res) => {
  const rental = await Rental.findById(req.params.id);
  if (!rental) return res.status(404).send('cannot find the rental ID');
  res.status(200).send(rental);
});

router.post('/', async (req, res) => {
  const session = await mongoose.startSession();
  try {
    const validatedData = validate(req.body);
    const result = await session.withTransaction(async () => {
      const customer = await Customer.findById(validatedData.customerId, {
        session,
      });
      if (!customer) throw new Error('CUSTOMER_NOT_FOUND');

      const movie = await Movie.findById(validatedData.movieId, { session });
      if (!movie) throw new Error('MOVIE_NOT_FOUND');

      if (movie.numberInStock === 0) throw new Error('OUT_OF_STOCK');

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

      movie.numberInStock--;
      await movie.save({ session });
      return await rental.save({ session });
    });
    res.status(201).send(result);
  } catch (err) {
    if (err.message === 'CUSTOMER_NOT_FOUND') {
      return res.status(404).send('Cannot find the customer');
    }
    if (err.message === 'MOVIE_NOT_FOUND') {
      return res.status(404).send('Cannot find the movie');
    }
    if (err.message === 'OUT_OF_STOCK') {
      return res.status(400).send('Movie not in stock.');
    }
    if (err instanceof z.ZodError) {
      return res
        .status(400)
        .send(err.issues.map((issue) => issue.message).join('\n'));
    }
    console.log('🚀 ~ err:', err);
    return res.status(500).send('An unexpected Error Occurred');
  } finally {
    await session.endSession();
  }
});

module.exports = router;
