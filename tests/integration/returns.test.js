const mongoose = require('mongoose');
const { Rental } = require('../../models/rental');
const request = require('supertest');

// POST /api/returns {customerId, movieId}
describe('/api/returns', () => {
  let server;
  let customerId;
  let movieId;
  let rental;

  beforeAll(() => {});

  beforeEach(async () => {
    server = require('../../');
    customerId = new mongoose.Types.ObjectId();
    movieId = new mongoose.Types.ObjectId();

    rental = new Rental({
      customer: {
        _id: customerId,
        name: 'Reacher',
        phone: '12345',
      },
      movie: {
        _id: movieId,
        title: 'movie title',
        dailyRentalRate: 2,
      },
    });

    await rental.save();
  });

  afterAll(async () => {
    await server.close();
    await mongoose.disconnect();
  });

  afterEach(async () => {
    await Rental.deleteMany({});
  });

  it('should work', async () => {
    const result = await Rental.findById(rental._id);
    expect(result).not.toBeNull();
  });

  it('Return 401 if client is not logged in ', async () => {
    const response = await request(server)
      .post('/api/returns')
      .send({ customerId, movieId });

    expect(response.status).toBe(401);
  });

  // Return 400 if customerId not provided

  // Return 400 if movieId not provided

  // Return 404 if no rental found for this customer/movie

  // Return 400 if rental already processed

  // Return 200 if valid request

  // Set the return date

  // Calculate the rental fee

  // Increase the stock

  // Return the rental
});
