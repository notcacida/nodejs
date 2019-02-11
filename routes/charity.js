var express = require('express');
var router = express.Router();

var charityController = require('../controllers/charity');

// Add charity
router.post('/', charityController.postCharity);
/* Get all charities */
router.get('/', charityController.getCharities);
// Get charity by id
router.get('/:_id', charityController.getCharityPerId);
// Update charity
router.put('/:_id', charityController.putCharityById);
// Delete charity
router.delete('/:charityId', charityController.deleteCharity);

module.exports = router;
