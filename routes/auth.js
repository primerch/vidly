const express = require('express');
const { User } = require('../models/user');
const router = express.Router();
const bcrypt = require('bcrypt');
const z = require('zod');

router.post('/', async (req, res) => {
  const { success, data, error } = validate(req.body);

  if (!success)
    return res.status(400).send(
      error.issues
        .map((issue) => {
          return issue.path + ': ' + issue.message;
        })
        .join(', ')
    );

  let user = await User.findOne({ email: data.email });

  if (!user) return res.status(400).send('Invalid Email or Password');

  const validPassword = await bcrypt.compare(data.password, user.password);
  if (!validPassword) return res.status(400).send('Invalid Email or Password');
  return true;
});

const validate = (req) => {
  const schema = z.object({
    email: z.email().min(5).max(255),
    password: z.string().min(5).max(1024),
  });
  return schema.safeParse(req);
};

module.exports = router;
