const z = require('zod');
const mongoose = require('mongoose');

const Customer = mongoose.model(
  'Customer',
  new mongoose.Schema({
    name: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 50,
    },
    isGold: {
      type: Boolean,
      default: false,
    },
    phone: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 50,
    },
  })
);

function validateCustomer(customer) {
  const schema = z.object({
    name: z.string().min(5).max(50),
    phone: z.string().min(5).max(50),
    isGold: z.boolean().optional(),
  });

  return schema.parse(customer);
}

exports.Customer = Customer;
exports.validate = validateCustomer;
