const { Movie, validate } = require('../models/movie');
const z = require('zod');
const express = require('express');
const { Genre } = require('../models/genre');
const router = express.Router();

router.get('/', async (req, res) => {
  const result = await Movie.find().sort('name');
  res.status(200).send(result);
});

router.get('/:id', async (req, res) => {
  const movie = await Movie.findById(req.params.id);
  if (!movie)
    return res.status(404).send('Cannot find the movie with given ID');

  return res.status(200).send(movie);
});

router.post('/', async (req, res) => {
  try {
    const validatedMovie = validate(req.body);

    const genre = await Genre.findById(validatedMovie.genreId);
    if (!genre) return res.status(400).send('Invalid genre.');

    const movie = new Movie({
      title: validatedMovie.title,
      genre: {
        _id: genre._id,
        name: genre.name,
      },
      numberInStock: validatedMovie.numberInStock,
      dailyRentalRate: validatedMovie.dailyRentalRate,
    });

    const result = await movie.save();

    res.status(200).send(result);
  } catch (err) {
    if (err instanceof z.ZodError)
      return res
        .status(400)
        .send(err.issues.map((issue) => issue.message).join(', '));
    return res.status(500).send('An unexpected Error Occurred');
  }
});
module.exports = router;
