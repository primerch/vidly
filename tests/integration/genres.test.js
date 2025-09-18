const request = require('supertest');
const { Genre, genreSchema } = require('../../models/genre');
const mongoose = require('mongoose');
const { User } = require('../../models/user');

let server;

describe('/api/genres', () => {
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

  describe('GET /', () => {
    it('should return all genres', async () => {
      await Genre.collection.insertMany([
        { name: 'genre1' },
        { name: 'genre2' },
      ]);
      const res = await request(server).get('/api/genres');

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.some((g) => g.name === 'genre1')).toBeTruthy;
      expect(res.body.some((g) => g.name === 'genre2')).toBeTruthy;
    });
  });

  describe('GET /:id', () => {
    it('should return genre if valid id is passed', async () => {
      const genre = new Genre({ name: 'genre1' });
      await genre.save();

      const response = await request(server).get(`/api/genres/${genre._id}`);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('name', genre.name);
    });

    it('should return 404 if invalid id is passed', async () => {
      const response = await request(server).get(`/api/genres/1`);
      expect(response.status).toBe(404);
      expect(response.text).toBe('The genre with the give Id not found');
    });
  });

  describe('POST /', () => {
    it('should return 401 if client is not logged in', async () => {
      const response = await request(server)
        .post('/api/genres')
        .send({ name: 'genre1' });

      expect(response.status).toBe(401);
    });

    it('should return 400 if genre is less than 5 characters', async () => {
      const token = await new User().generateAuthToken();
      const response = await request(server)
        .post('/api/genres')
        .set('Authorization', token)
        .send({ name: '1234' });
      expect(response.status).toBe(400);
    });

    it('should return 400 if genre is more than 50 characters', async () => {
      const token = await new User().generateAuthToken();

      const name = new Array(52).join('a');

      const response = await request(server)
        .post('/api/genres')
        .set('Authorization', token)
        .send({ name });
      expect(response.status).toBe(400);
    });
  });
});
