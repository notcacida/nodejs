// Verify token
module.exports = verifyToken = (req, res, next) => {
  // Get the auth header value
  const bearerHeader = req.headers['authorization'];
  if (typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(' ');
    const bearerToken = bearer[1];
    req.token = bearerToken;
    // Go to next middleware
    next();
  } else {
    // Forbidden
    res.sendStatus(403);
  }
};
