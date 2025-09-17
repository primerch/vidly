const request = require('supertest');
const { Genre } = require('../../models/genre');
const mongoose = require('mongoose');

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
      const res = await request(server).get('/api/genres');
      expect(res.status).toBe(200);
    });
  });
});
