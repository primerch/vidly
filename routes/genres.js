const auth = require('../middleware/auth');
const express = require('express');
const z = require('zod');
const { Genre, validate } = require('../models/genre');
const admin = require('../middleware/admin');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const genres = await Genre.find().sort('name');
    res.send(genres);
  } catch (e) {
    next(e);
  }
});

router.get('/:id', async (req, res) => {
  const genre = await Genre.findById(req.params.id);

  if (!genre)
    return res.status(404).send('The genre with the given ID was not found.');

  res.send(genre);
});

router.post('/', auth, async (req, res) => {
  try {
    const body = req.body;

    const validatedGenre = validate(body);
    const newGenre = new Genre(validatedGenre);
    const result = await newGenre.save();
    res.status(201).send(result);
  } catch (err) {
    if (err instanceof z.ZodError)
      return res
        .status(400)
        .send(err.issues.map((issue) => issue.message).join(', '));
    else return res.status(500).send('An unexpected Error occurred');
  }
});

router.put('/:id', async (req, res) => {
  try {
    const validatedGenre = validate(req.body);

    const genre = await Genre.findByIdAndUpdate(req.params.id, validatedGenre, {
      new: true,
    });
    if (!genre)
      return res.status(404).send('The genre with the given ID was not found.');

    res.status(200).send(genre);
  } catch (err) {
    if (err instanceof z.ZodError)
      return res
        .status(400)
        .send(err.issues.map((issue) => issue.message).join('. '));
    else return res.status(500).send('An unexpected Error occurred');
  }
});

router.delete('/:id', [auth, admin], async (req, res) => {
  const genre = await Genre.findByIdAndDelete(req.params.id);
  if (!genre)
    return res.status(404).send('The genre with the given ID was not found.');

  res.status(204).send(genre);
});

module.exports = router;
