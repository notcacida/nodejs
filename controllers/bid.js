const Bid = require('../models/Bid');
const User = require('../models/User');
const Product = require('../models/product');
const BidHistorical = require('../models/Bid_history');

// Aux Actions

// Withdraws bid price from user's wallet
let takeFromWallet = (price, buyerId) => {
  User.findById(buyerId)
    .then(user => {
      user.wallet = user.wallet - price;
      user.save();
    })
    .catch(err => {
      console.log(err);
    });
};

// Gets price of product user bidded on
let payForProduct = (prodId, buyerId) => {
  console.log('take from wallet of', buyerId, ' price of ', prodId);
  Product.findById(prodId).then(product => {
    console.log(product);
    takeFromWallet(product.price, buyerId);
  });
};

// MAIN ACTIONS

// Add a bid

// Bid is added to historical collection READ_ONLY
// Bid is added to regular collection
// Amount is withdrawn from user's wallet: payForProduct -> takeFromWallet

exports.addBid = (req, res, next) => {
  const userThatMadeBid = req.user;
  const productId = req.body.product;
  const charityId = req.body.charity;
  const bid = new Bid({
    user: userThatMadeBid,
    product: productId,
    charity: charityId
  });
  const historyBid = new BidHistorical({
    user: userThatMadeBid,
    product: productId,
    charity: charityId
  });
  // Add bid to history
  historyBid.save().catch(err => {
    console.log(err);
  });
  // Add bid to regular collection
  bid
    .save()
    .then(bid => {
      payForProduct(bid.product, userThatMadeBid);
      res.send(bid);
    })
    .catch(err => {
      console.log(err);
    });
};

// Get all bids
exports.getAllBids = (req, res, next) => {
  Bid.find()
    .populate('product')
    .populate('charity')
    .then(bids => {
      res.status(200).send(bids);
    })
    .catch(err => {
      console.log(err);
    });
};
// Get historical bids
exports.getHistoricalBids = (req, res, next) => {
  BidHistorical.find()
    .then(bids => {
      res.status(200).send(bids);
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
    .populate('product')
    .populate('charity')
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
    .populate('product')
    .populate('charity')
    .then(bid => {
      res.send(bid);
    })
    .catch(err => {
      console.log(err);
      res.status(404).send('404 Not found');
    });
};

let refundUser = userId => {
  User.findById(userId).then(user => {
    // add to user's wallet : bid.amount ;)
  });
};

// Delete a bid
// -> Refund user
exports.deleteBid = (req, res, next) => {
  const bidId = req.params.bidId;
  Bid.findByIdAndRemove(bidId)
    .then(bid => {
      refundUser(bid.user);
      res.send(bid);
    })
    .catch(err => {
      console.log(err);
      res.status(404).send('404 Not found');
    });
};
