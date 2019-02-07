const Bid = require('../models/Bid');

// MAIN ACTIONS
// Add a bid
exports.addBid = (req, res, next) => {
  const userThatMadeBid = req.user;
  const productId = req.body.product;
  const bid = new Bid({
    user: userThatMadeBid,
    product: productId
  });
  bid
    .save()
    .then(bid => {
      res.send(bid);
      // which status to send?
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
    });
};
