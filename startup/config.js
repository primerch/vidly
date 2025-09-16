require('dotenv').config();

module.exports = function () {
  if (!process.env.JWT_SECRET) {
    console.error('FATAL ERROR: jstPrivateKey is not defined.');
    process.exit(1);
  }
};
