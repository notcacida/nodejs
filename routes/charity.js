var express = require('express');
var router = express.Router();

var charityControler = require('../controllers/charity');

/* Get all products */
router.get('/', charityControler.getCharities);
//get product by id

router.get('/:_id', charityControler.getCharityPerId);

router.post('/', charityControler.postCharity);

router.put('/:_id', charityControler.putCharityById);

router.delete('/:_id', charityControler.deleteCharity);

module.exports = router;
