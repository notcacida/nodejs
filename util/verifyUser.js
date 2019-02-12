// Verify token
module.exports = verifyUser = (req, res, next) => {
  // Get the auth header value
  const bearerHeader = req.headers['authorization'];
  if (typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(' ');
    const bearerToken = bearer[1];
    req.token = bearerToken;
    // Go to next middleware as logged in user
    next();
  } else {
    // Go to next middleware as guest
    next();
  }
};
