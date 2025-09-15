const express = require('express');
const { User } = require('../models/user');
const router = express.Router();
const bcrypt = require('bcrypt');
const z = require('zod');

// Correct approach: Generate the secret ONCE, outside of the request handler.
// This is a placeholder. REMEMBER to replace this with an environment variable later.

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

  const token = await dbUser.generateAuthToken();
  return res.status(201).send(token);
});

const validate = (req) => {
  const schema = z.object({
    email: z.email().min(5).max(255),
    password: z.string().min(5).max(1024),
  });
  return schema.safeParse(req);
};

module.exports = router;
