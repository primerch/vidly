const express = require('express');
const { User, validate } = require('../models/user');
const router = express.Router();

router.get('/', async (req, res) => {
  const result = await User.find().sort('name');
  res.status(200).send(result);
});

router.get('/:id', async (req, res) => {});

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

  user = new User(data);

  const { _id, name, email } = await user.save();

  res.status(200).send({ _id, name, email });
});

module.exports = router;
