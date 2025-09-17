const app = require('../../index');
const request = require('supertest');
const { Genre } = require('../../models/genre');
const mongoose = require('mongoose');

let server; // Variable to hold the server instance

describe('/api/genres', () => {
  beforeEach(() => {
    server = app.listen(0); // Start server on a random port for tests
  });

  afterEach((done) => {
    // Close the server after all tests in this suite
    server.close(done);
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
      expect(res.body.some((g) => g.name === 'genre1')).toBeTruthy();
      expect(res.body.some((g) => g.name === 'genre2')).toBeTruthy();
    });
  });
});
