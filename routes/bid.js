const express = require('express');
const router = express.Router();

const bidController = require('../controllers/bid');
const verifyToken = require('../util/verifyToken');
const verifyLoggedIn = require('../util/verifyLoggedIn');

// Add a bid
// Verify token will only let user continue if an Authorization header is sent with request
// Otherwise, get a 403
// This token is checked further in the controller

// VerifyLoggedIn will only let user continue if his token has not been logged-out in the meantime

router.post(
  '/',
  verifyToken,
  verifyLoggedIn,
  bidController.checkFunds,
  bidController.addBid
);

// Get all bids
router.get('/', verifyLoggedIn, bidController.getAllBids);

// Get historical bids
router.get('/historical', verifyLoggedIn, bidController.getHistoricalBids);

// Get one bid
router.get('/bid/:bidId', verifyLoggedIn, bidController.getBid);

// Get bids of user
router.get('/user/:userId', verifyLoggedIn, bidController.getBidsOfUser);

// Get bids on product
router.get(
  '/product/:productId',
  verifyLoggedIn,
  bidController.getBidsOnProduct
);

// Delete bid
router.delete('/:bidId', verifyLoggedIn, bidController.deleteBid);

// Delete all bids
router.delete('/', verifyToken, verifyLoggedIn, bidController.deleteAll);

module.exports = router;
