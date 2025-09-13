const express = require('express');
const { User, validate } = require('../models/user');
const router = express.Router();

router.get('/', async (req, res) => {
  const result = await User.find().sort('name');
  res.status(200).send(result);
});

router.get('/:id', async (req, res) => {});

router.post('/', async (req, res) => {
  const validatedResult = validate(req.body);

  if (!validatedResult.success)
    return res.status(400).send(
      validatedResult.error.issues
        .map((issue) => {
          return issue.path + ': ' + issue.message;
        })
        .join(', ')
    );

  const user = await User.findOne({ email: validatedResult.data.email });

  if (user) return res.status(400).send('User already resigereds');

  const newUser = new User(validatedResult.data);
  const result = await newUser.save();
  res.status(200).send(result);
});

module.exports = router;
