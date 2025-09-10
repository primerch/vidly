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
  const schema = z.object({
    name: z.string().min(5).max(50),
  });

  return schema.parse(genre);
}

exports.Genre = Genre;
exports.validate = validateGenre;
