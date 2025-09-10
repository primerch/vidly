const express = require('express');
const z = require('zod');
const { Customer, validate } = require('../models/customer');

const router = express.Router();

router.get('/', async (req, res) => {
  const customers = await Customer.find().sort('name');
  res.send(customers);
});

router.get('/:id', async (req, res) => {
  const customer = await Customer.findById(req.params.id);

  if (!customer)
    return res
      .status(404)
      .send('The customer with the given ID was not found.');

  res.send(customer);
});

router.post('/', async (req, res) => {
  try {
    const validatedCustomer = validate(req.body);
    const newCustomer = new Customer(validatedCustomer);
    const result = await newCustomer.save();
    res.status(201).send(result);
  } catch (err) {
    if (err instanceof z.ZodError)
      return res
        .status(400)
        .send(err.issues.map((issue) => issue.message).join(', '));
    else return res.status(500).send('An enexpected Error occurred');
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
    if (!customer)
      return res
        .status(404)
        .send('The customer with the given ID was not found.');

    res.status(200).send(customer);
  } catch (err) {
    if (err instanceof z.ZodError)
      return res
        .status(400)
        .send(err.issues.map((issue) => issue.message).join('. '));
    else return res.status(500).send('An enexpected Error occured');
  }
});

router.delete('/:id', async (req, res) => {
  const customer = await Customer.findByIdAndDelete(req.params.id);
  if (!customer)
    return res
      .status(404)
      .send('The customer with the given ID was not found.');

  res.status(204).send(customer);
});

module.exports = router;
