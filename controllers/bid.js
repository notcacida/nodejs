const Bid = require('../models/Bid');

// ACTIONS

// Add a bid
exports.addBid = (req, res, next) => {
  const amount = req.body.amount;
  const userThatMadeBid = req.user;
  const bid = new Bid({
    amount: amount,
    user: userThatMadeBid
  });
  bid
    .save()
    .then(bid => {
      console.log(bid);
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
      console.log('Succesfully removed bid: ', bid);
    })
    .catch(err => {
      console.log(err);
    });
};
