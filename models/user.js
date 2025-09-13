const mongoose = require('mongoose');
const z = require('zod');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 50,
  },
  email: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 255,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 1024,
  },
  isAdmin: Boolean,
});

const User = mongoose.model('User', userSchema);

const validateUser = (user) => {
  const schema = z.object({
    name: z.string().min(5).max(50),
    email: z.email().min(5).max(255),
    password: z.string().min(5).max(1024),
    isAdmin: z.boolean().optional(),
  });
  return schema.parse(user);
};

module.exports.User = User;
module.exports.validate = validateUser;
