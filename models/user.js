const mongoose = require('mongoose');
const z = require('zod');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxLength: 255,
  },
  email: {
    type: String,
    unique: true,
    maxLength: 255,
  },
  password: {
    type: String,
    maxLength: 255,
  },
});

const model = mongoose.model('User', userSchema);

const validate = (user) => {
  const schema = z.object({
    name: z.string().max(255),
    email: z.string().max(255).optional(),
    password: z.string().max(25),
  });
  return schema.parse(user);
};

module.exports.User = model;
module.exports.validate = validate;
