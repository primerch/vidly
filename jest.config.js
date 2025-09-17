module.exports = {
  preset: '@shelf/jest-mongodb',
  setupFilesAfterEnv: ['./jest.setup.js'], // this file runs before tests
  transformIgnorePatterns: ['/node_modules/(?!jose)'],
};
