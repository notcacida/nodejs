const Bid = require('../models/Bid');
const BidH = require('../models/Bid_history');
// ACTIONS

// Add a bid
exports.addBid = (req, res, next) => {
  const userThatMadeBid = req.user;
  const productId = req.body.product;
  const bid = new Bid({
    user: userThatMadeBid,
    product: productId
  });
  const historyBid = new BidH({
    user: userThatMadeBid,
    product: productId
  });
  //add bid to history
  historyBid.save();

  bid
    .save()
    .then(bid => {
      res.send(bid);
    })
    .catch(err => {
      console.log(err);
    });
};

// Get all bids
exports.getAllBids = (req, res, next) => {
  Bid.find()
    .then(bids => {
      res.send(bids);
    })
    .catch(err => {
      console.log(err);
    });
};

// Get bids of user
exports.getBidsOfUser = (req, res, next) => {
  const userId = req.params.userId;
  Bid.find({
    user: userId
  })
    .then(result => {
      res.send(result);
    })
    .catch(err => {
      console.log(err);
      res.status(404).send('404 Not found');
    });
};

// Get one bid
exports.getBid = (req, res, next) => {
  const bidId = req.params.bidId;
  Bid.findById(bidId)
    .then(bid => {
      res.send(bid);
    })
    .catch(err => {
      console.log(err);
      res.status(404).send('404 Not found');
    });
};

// Delete a bid
exports.deleteBid = (req, res, next) => {
  const bidId = req.params.bidId;
  Bid.findByIdAndRemove(bidId)
    .then(bid => {
      res.send(bid);
    })
    .catch(err => {
      console.log(err);
      res.status(404).send('404 Not found');
    });
};
