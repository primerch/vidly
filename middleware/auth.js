const jose = require('jose');

module.exports = async function (req, res, next) {
  const authHeader = req.header('Authorization');
  if (!authHeader)
    return res.status(401).send('Access Defined. No Token Provided.');

  const token = authHeader.replace('Bearer ', '');
  const keyString = process.env.JWT_SECRET;
  const secret = new TextEncoder().encode(keyString);
  try {
    const { payload } = await jose.jwtVerify(token, secret);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(400).send('Invalid token.');
  }
};
