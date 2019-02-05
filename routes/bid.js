const express = require('express');
const router = express.Router();

const bidController = require('../controllers/bid');

// Add a bid
router.post('/', bidController.addBid);

// Get all bids
router.get('/', bidController.getAllBids);

// Get one bid
router.get('/bid/:bidId', bidController.getBid);

// Get bids of user
router.get('/user/:userId', bidController.getBidsOfUser);

// Delete bid
router.delete('/:bidId', bidController.deleteBid);

module.exports = router;
