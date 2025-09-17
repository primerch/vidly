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
});
