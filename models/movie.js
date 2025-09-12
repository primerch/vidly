const z = require('zod');
const mongoose = require('mongoose');
const { genreSchema } = require('./genre');

const Movie = mongoose.model(
  'Movie',
  new mongoose.Schema({
    title: {
      type: String,
      required: true,
      trim: true,
      minLength: 5,
      maxLength: 255,
    },
    genre: { type: genreSchema, required: true },
    numberInStock: { type: Number, required: true, min: 0, max: 255 },
    dailyRentalRate: { type: Number, required: true, min: 0, max: 255 },
  })
);

// Custom ObjectID Schema
const objectIdSchema = z
  .string()
  .refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: 'Invalid ObjectId',
  });

function validateMovie(movie) {
  const schema = z.object({
    title: z.string().min(5).max(255),
    genreId: objectIdSchema,
    numberInStock: z.number().min(0),
    dailyRentalRate: z.number().min(0),
  });
  return schema.parse(movie);
}

module.exports.Movie = Movie;
module.exports.validate = validateMovie;
