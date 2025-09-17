const app = require('../../index');
const request = require('supertest');

describe('/api/genres', () => {
  describe('GET /', () => {
    it('should return all genres', async () => {
      const result = await request(app).get('/api/users');
      console.log(result);
    });
  });
});
