let InvalidToken = require('../models/Invalid_token');

module.exports = (req, res, next) => {
  // Get the auth header value
  const bearerHeader = req.headers['authorization'];
  if (typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(' ');
    const bearerToken = bearer[1];
    // Check this bearer token against invalid tokens
    InvalidToken.find({
      token: bearerToken
    })
      .then(result => {
        if (result.length) {
          res.status(403).json({ error: 'You are not logged-in' });
        } else {
          next();
        }
      })
      .catch(err => {
        console.log(err);
      });
  } else {
    // User is guest so don't check if he logged out
    next();
  }
};
