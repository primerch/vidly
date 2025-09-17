const mongoose = require('mongoose');

beforeAll(async () => {
  console.log('🚀 Connecting to in-memory MongoDB at:', global.__MONGO_URI__);
  await mongoose.connect(global.__MONGO_URI__);
});

afterAll(async () => {
  await mongoose.connection.close();
});

afterEach(async () => {
  // optional: clean all collections after each test
  const collections = Object.values(mongoose.connection.collections);
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});
