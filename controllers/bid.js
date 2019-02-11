const Bid = require('../models/Bid');
const User = require('../models/User');
const Product = require('../models/product');
const BidHistorical = require('../models/Bid_history');

// Order is:    Check funds -> add bid -> checkout product -> pay for product

// Check if user has enough funds: used as middleware in ROUTES: bid.js
exports.checkFunds = (req, res, next) => {
  let user = req.user;
  let product = req.body.product;
  Product.findById(product)
    .then(product => {
      if (user.wallet >= product.bid_price) {
        next();
      } else {
        res.status(403).json('User does not have enough credit to bid.');
      }
    })
    .catch(err => {
      console.log(err);
    });
};

// Withdraw bid price from user's wallet
let payForProduct = (price, buyerId) => {
  User.findById(buyerId)
    .then(user => {
      user.wallet = user.wallet - price;
      user.save();
    })
    .catch(err => {
      console.log(err);
    });
};

// Checkout product user bidded on
let checkoutProduct = (prodId, buyerId) => {
  Product.findById(prodId).then(product => {
    payForProduct(product.bid_price, buyerId);
  });
};

// MAIN ACTIONS

// Add a bid
// Bid is added to historical collection READ_ONLY
// Bid is added to regular collection
// Amount is withdrawn from user's wallet

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
      checkoutProduct(bid.product, userThatMadeBid);
      res.json(bid);
    })
    .catch(err => {
      console.log(err);
    });
};

// Get all bids
exports.getAllBids = (req, res, next) => {
  Bid.find()
    .then(bids => {
      res.status(200).json(bids);
    })
    .catch(err => {
      console.log(err);
    });
};
// Get historical bids
exports.getHistoricalBids = (req, res, next) => {
  BidHistorical.find()
    .then(bids => {
      res.status(200).json(bids);
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
      res.json(result);
    })
    .catch(err => {
      console.log(err);
      res.status(404).json('404 Not found');
    });
};

// Get bids on product
exports.getBidsOnProduct = (req, res, next) => {
  const prodId = req.params.prodId;
  Bid.find({
    product: prodId
  })
    .then(result => {
      res.json(result);
    })
    .catch(err => {
      console.log(err);
      res.status(404).json('404 Not found');
    });
};

// Get one bid
exports.getBid = (req, res, next) => {
  const bidId = req.params.bidId;
  Bid.findById(bidId)
    .then(bid => {
      res.json(bid);
    })
    .catch(err => {
      console.log(err);
      res.status(404).json('404 Not found');
    });
};

// Delete a bid
// Refund user
let refundUser = (prodId, buyerId) => {
  Product.findById(prodId).then(product => {
    payForProduct(-product.bid_price, buyerId);
  });
};
exports.deleteBid = (req, res, next) => {
  const bidId = req.params.bidId;
  Bid.findByIdAndRemove(bidId)
    .then(bid => {
      res.json(bid);
      refundUser(bid.product, bid.user);
    })
    .catch(err => {
      console.log(err);
      res.status(404).json('404 Not found');
    });
};

exports.refundUser = refundUser;
