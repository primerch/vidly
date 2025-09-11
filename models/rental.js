const mongoose = require('mongoose');
const z = require('zod');

const Rental = mongoose.model(
  'Rental',
  new mongoose.Schema({
    customer: {
      name: {
        type: String,
        required: true,
        minLength: 5,
        maxLength: 50,
      },
      isGold: {
        type: Boolean,
      },
      phone: {
        type: String,
        required: true,
        minLength: 5,
        maxLength: 50,
      },
    },
    movie: {
      title: {
        type: String,
        required: true,
        trim: true,
        minLength: 5,
        maxLength: 255,
      },
    },
    dateOut: {
      type: Date,
      required: true,
      default: Date.now,
    },
    dateReturned: {
      type: Date,
    },
    rentalFee: {
      type: Number,
      min: 0,
    },
  })
);

const validateRental = (rental) => {
  const schema = z.object({
    customerId: z.string(),
    movieId: z.string(),
    dateOut: z.date().optional(),
    dateReturned: z.date().optional(),
    rentalFee: z.number().optional(),
  });

  return schema.parse(rental);
};

module.exports.Rental = Rental;
module.exports.validate = validateRental;
