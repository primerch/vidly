const request = require('supertest');
const { Genre } = require('../../models/genre');
const mongoose = require('mongoose');

let server;

describe('/api/genres', () => {
  beforeEach(() => { server = require('../../index'); });

  afterEach(async () => { await server.close(); });

  describe('GET /', () => {
    it('should return all genres', async () => {
      const res = await request(server).get('/api/genres');
      expect(res.status).toBe(200);
    });
  });
});
