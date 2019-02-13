var express = require('express');
var router = express.Router();

const verifyToken = require('../util/verifyToken');
const verifyLoggedIn = require('../util/verifyLoggedIn');

var charityController = require('../controllers/charity');

// Add charity
// Verify token will only let user continue if an Authorization header is sent with request
// Otherwise, get a 403
// Type of user making request is further checked in controller

router.post('/', verifyToken, verifyLoggedIn, charityController.postCharity);

/* Get all charities */
router.get('/', charityController.getCharities);

// Get charity by id
router.get('/:_id', charityController.getCharityPerId);

// Update charity
router.put(
  '/:_id',
  verifyToken,
  verifyLoggedIn,
  charityController.putCharityById
);
// Delete charity
router.delete(
  '/:charityId',
  verifyToken,
  verifyLoggedIn,
  charityController.deleteCharity
);

module.exports = router;
