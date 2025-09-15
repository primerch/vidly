const jose = require('jose');
const express = require('express');
const { User } = require('../models/user');
const router = express.Router();
const bcrypt = require('bcrypt');
const z = require('zod');

// Correct approach: Generate the secret ONCE, outside of the request handler.
// This is a placeholder. REMEMBER to replace this with an environment variable later.
const keyString = process.env.JWT_SECRET;
console.log('🚀 ~ keyString:', keyString);
const secret = new TextEncoder().encode(keyString);

router.post('/', async (req, res) => {
  const { success, data: user, error } = validate(req.body);

  if (!success) {
    return res
      .status(400)
      .send(
        error.issues
          .map((issue) => `${issue.path}: ${issue.message}`)
          .join(', ')
      );
  }

  let dbUser = await User.findOne({ email: user.email });
  if (!dbUser) return res.status(400).send('Invalid Email or Password');

  const validPassword = await bcrypt.compare(user.password, dbUser.password);
  if (!validPassword) return res.status(400).send('Invalid Email or Password');

  const payload = {
    _id: dbUser._id,
  };

  try {
    const jwt = new jose.SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('1h');
    const token = await jwt.sign(secret);
    res.status(200).send(token);
  } catch (err) {
    console.error('JWT signing failed:', err);
    res.status(500).send('Failed to generate token.');
  }
});

const validate = (req) => {
  const schema = z.object({
    email: z.email().min(5).max(255),
    password: z.string().min(5).max(1024),
  });
  return schema.safeParse(req);
};

module.exports = router;
