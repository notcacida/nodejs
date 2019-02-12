const express = require('express');
const router = express.Router();

const bidController = require('../controllers/bid');
const verifyToken = require('../util/verifyToken');

// Add a bid
// Verify token will only let user continue if an Authorization header is sent with request
// Otherwise, get a 403
// This token is checked further in the controller

router.post('/', verifyToken, bidController.checkFunds, bidController.addBid);

// Get all bids
router.get('/', bidController.getAllBids);

// Get historical bids
router.get('/historical', bidController.getHistoricalBids);

// Get one bid
router.get('/bid/:bidId', bidController.getBid);

// Get bids of user
router.get('/user/:userId', bidController.getBidsOfUser);

// Get bids on product
router.get('/product/:productId', bidController.getBidsOnProduct);

// Delete bid
router.delete('/:bidId', bidController.deleteBid);

// Delete all bids
router.delete('/', bidController.deleteAll);

module.exports = router;
