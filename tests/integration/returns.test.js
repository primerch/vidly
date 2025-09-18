const mongoose = require('mongoose');
const { Rental } = require('../../models/rental');
const request = require('supertest');
const { User } = require('../../models/user');
const { Customer } = require('../../models/customer');

// POST /api/returns {customerId, movieId}
describe('/api/returns', () => {
  let server;
  let customerId;
  let movieId;
  let rental;
  let token;

  const exec = () => {
    return request(server).post('/api/returns').send({ customerId, movieId });
  };

  beforeAll(() => {});

  beforeEach(async () => {
    server = require('../../');
    customerId = new mongoose.Types.ObjectId();
    movieId = new mongoose.Types.ObjectId();
    token = await new User().generateAuthToken();
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
    token = '';
    const response = await request(server)
      .post('/api/returns')
      .send({ customerId, movieId });

    expect(response.status).toBe(401);
  });

  // Return 400 if customerId not provided
  it('should return 400 if customerId is not provided', async () => {
    customerId = '';

    const response = await exec();

    expect(response.status).toBe(400);
  });

  // Return 400 if movieId not provided
  it('should return 400 if movieId not provided', async () => {
    movieId = '';

    const response = await exec();

    expect(response.status).toBe(400);
  });

  it('should return 404 if no rental found for the customer/movie ', async () => {
    await Rental.deleteMany({});

    const response = await exec();

    expect(response.status).toBe(404);
  });

  // Return 400 if rental already processed
  it('should return 400 if rental is already processed', async () => {
    rental.dateReturned = new Date();

    await rental.save();

    const response = await exec();

    expect(response.status).toBe(400);
  });

  // Return 200 if valid request

  // Set the return date

  // Calculate the rental fee

  // Increase the stock

  // Return the rental
});
