const z = require('zod');
const mongoose = require('mongoose');

const Genre = mongoose.model(
  'Genre',
  new mongoose.Schema({
    name: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 50,
    },
  })
);

function validateGenre(genre) {
  const schema = {
    name: z.string().min(3),
  };

  return z.parse(genre);
}

exports.Genre = Genre;
exports.validate = validateGenre;
