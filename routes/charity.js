var express = require('express');
var router = express.Router();

var charityControler = require('../controllers/charity');

// Add charity
router.post('/', charityControler.postCharity);
/* Get all charities */
router.get('/', charityControler.getCharities);
// Get charity by id
router.get('/:_id', charityControler.getCharityPerId);
// Update charity
router.put('/:_id', charityControler.putCharityById);
// Delete charity
router.delete('/:charityId', charityControler.deleteCharity);

module.exports = router;
