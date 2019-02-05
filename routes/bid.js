const express = require('express');
const router = express.Router();

const bidController = require('../controllers/bid');

// Add a bid
router.post('/', bidController.addBid);
// Get all bids
router.get('/', bidController.getAllBids);
// Get bids of one particular user
router.get('/:userId', bidController.getBidsOfUser);
// Get one bid
router.get('/:bidId', bidController.getBid);
// Delete bid
router.delete('/:bidId', bidController.deleteBid);

module.exports = router;
