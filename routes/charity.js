var express = require('express');
var router = express.Router();

var charityController = require('../controllers/charity');
const verifyToken = require('../util/verifyToken');

// Add charity
// Verify token will only let user continue if an Authorization header is sent with request
// Otherwise, get a 403
// Type of user making request is further checked in controller

router.post('/', verifyToken, charityController.postCharity);
/* Get all charities */
router.get('/', charityController.getCharities);
// Get charity by id
router.get('/:_id', charityController.getCharityPerId);
// Update charity
router.put('/:_id', verifyToken, charityController.putCharityById);
// Delete charity
router.delete('/:charityId', verifyToken, charityController.deleteCharity);

module.exports = router;
