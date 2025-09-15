const auth = require('../middleware/auth');
const express = require('express');
const { User, validate } = require('../models/user');
const router = express.Router();
const bcrypt = require('bcrypt');

router.get('/me', auth, async (req, res) => {
  console.log('🚀 ~ req:', req);
  const id = req.user.id;
  const user = await User.findById(id).select('-password');
  res.status(200).send(user);
});

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

  if (user) return res.status(400).send('User already registered.');

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(data.password, salt);

  user = new User({ ...data, password: hashedPassword });

  const { _id, name, email } = await user.save();

  //
  const token = await user.generateAuthToken();

  res.header('Authorization', `Bearer ${token}`).send({ _id, name, email });
});

module.exports = router;
