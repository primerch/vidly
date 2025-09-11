const z = require('zod');
const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
});

const Genre = mongoose.model('Genre', schema);

function validateGenre(genre) {
  const schema = z.object({
    name: z.string().min(5).max(50),
  });

  return schema.parse(genre);
}

exports.Genre = Genre;
exports.validate = validateGenre;
exports.genreSchema = schema;
