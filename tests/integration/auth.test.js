const request = require('supertest');
const mongoose = require('mongoose');
const { User } = require('../../models/user');
const { Genre } = require('../../models/genre');
console.log('Type of request:', typeof request);
console.log('Request object:', request);

let server;
describe('auth middleware', () => {
  beforeAll(() => {
    server = require('../../index');
  });

  afterAll(async () => {
    await server.close();
    await mongoose.disconnect();
  });

  afterEach(async () => {
    await Genre.deleteMany({});
  });

  it('should return 401 if no token is provided', async () => {
    const token = '';
    const response = await request(server)
      .post('/api/genres')
      .set('Authorization', token)
      .send({ name: 'genre1' });

    expect(response.status).toBe(401);
  });

  it('should return 400 if token is invalid', async () => {
    const token = 'a';
    const response = await request(server)
      .post('/api/genres')
      .set('Authorization', token)
      .send({ name: 'genre1' });

    expect(response.status).toBe(400);
  });

  it('should return 201 if token is valid', async () => {
    const token = await new User().generateAuthToken();

    const response = await request(server)
      .post('/api/genres')
      .set('Authorization', token)
      .send({ name: 'genre1' });

    console.log('🚀 ~ response.status:', response.status);
    expect(response.status).toBe(201);
  });
});
