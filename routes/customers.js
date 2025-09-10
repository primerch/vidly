const express = require('express');
const z = require('zod');
const { Customer, validate } = require('../models/customer');

const router = express.Router();

router.get('/', async (req, res) => {
  const customers = await Customer.find();
  res.send(customers);
});

router.post('/', async (req, res) => {
  try {
    const validatedCustomer = validate(req.body);
    const newCustomer = new Customer(validatedCustomer);
    const result = await newCustomer.save();
    return res.status(200).send(result);
  } catch (err) {
    if (err instanceof z.ZodError)
      return res
        .status(400)
        .send(err.issues.map((issue) => issue.message).join(', '));
    else return res.status(500).send('An enexpected Error occured');
  }
});

router.put('/:id', async (req, res) => {
  try {
    const validatedCustomer = validate(req.body);
    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      validatedCustomer,
      {
        new: true,
      }
    );

    return res.status(200).send(customer);
  } catch (err) {
    if (err instanceof z.ZodError)
      return res
        .status(400)
        .send(err.issues.map((issue) => issue.message).join('. '));
    else return res.status(500).send('An enexpected Error occured');
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    return res.status(200).send(customer);
  } catch (err) {
    if (err instanceof z.ZodError)
      return res
        .status(400)
        .send(err.issues.map((issue) => issue.message).join('. '));
    else return res.status(500).send('An enexpected Error occured');
  }
});

module.exports = router;
