const jwt = require('jsonwebtoken');

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
  // Check token: user can add bid only with a token
  jwt.verify(req.token, 'secret', (err, authData) => {
    console.log('auth data', authData);
    if (err) {
      res.sendStatus(403);
    } else {
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
    }
  });
};

// Get all bids
exports.getAllBids = (req, res, next) => {
  // If user is not logged in, don't show bids
  // req.user is defined only when request has a TOKEN attached.
  if (typeof req.user === 'undefined') {
    res.json('Guest can not see all bids');
  } else if (req.user.role === 'admin') {
    // If user is admin, show all bids
    Bid.find()
      .then(bids => {
        res.status(200).json(bids);
      })
      .catch(err => {
        console.log(err);
      });
  } else if (req.user.role === 'user') {
    // If user is user, show his bids
    Bid.find({
      user: req.user._id
    })
      .then(bids => {
        res.status(200).json(bids);
      })
      .catch(err => {
        console.log(err);
      });
  }
};

// Get historical bids
// If user is not admin, don't show historical bids
exports.getHistoricalBids = (req, res, next) => {
  if (typeof req.user === 'undefined') {
    res.json('Guest can not see historical bids');
  } else if (req.user.role === 'admin') {
    BidHistorical.find()
      .then(bids => {
        res.status(200).json(bids);
      })
      .catch(err => {
        console.log(err);
      });
  }
};

// Get bids of user
exports.getBidsOfUser = (req, res, next) => {
  let showBids = () => {
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
  // Guest, don't show anything
  // Admin, show anything
  // Regular user, only show his bids if he wants them
  const userId = req.params.userId;
  if (typeof req.user === 'undefined') {
    res.json('Please login first');
  } else if (req.user.role === 'admin') {
    showBids();
  } else if (req.user.role === 'user') {
    if (userId.toString() !== req.user._id.toString()) {
      res.status(403).json('You can only see your own bids!');
    } else {
      showBids();
    }
  }
};

// Get bids on product

// Guest, don't show anything
// Regular user, don't show all bids on a product
// Admin, show everything
exports.getBidsOnProduct = (req, res, next) => {
  if (typeof req.user === 'undefined') {
    res.json('Guest cannot see bids on a product');
  } else if (req.user.role === 'admin') {
    const prodId = req.params.productId;
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
  } else if (req.user.role === 'user') {
    res.json('Regular users cannot see all bids on a product');
  }
};

// Get one bid

// Guest, don't show anything
// Regular user, get bid if it belongs to user
// Admin, show everything
exports.getBid = (req, res, next) => {
  const bidId = req.params.bidId;
  if (typeof req.user === 'undefined') {
    res.json('Guest cannot see bids');
  } else if (req.user.role === 'admin') {
    Bid.findById(bidId)
      .then(bid => {
        res.json(bid);
      })
      .catch(err => {
        console.log(err);
        res.status(404).json('404 Not found');
      });
  } else if (req.user.role === 'user') {
    Bid.find({
      _id: bidId,
      user: req.user._id
    })
      .then(bid => {
        res.json(bid);
      })
      .catch(err => {
        console.log(err);
      });
  }
};

// Delete a bid
// Refund user

// Admin can delete any bid
// User can only delete his own bid

let refundUser = (prodId, buyerId) => {
  Product.findById(prodId).then(product => {
    payForProduct(-product.bid_price, buyerId);
  });
};
exports.deleteBid = (req, res, next) => {
  // Bid to delete
  const bidId = req.params.bidId;
  // Guest cannot delete bids
  if (typeof req.user === 'undefined') {
    res.json('Guest cannot delete bids');
  } else if (req.user.role === 'admin') {
    // Admin can delete any bid
    Bid.findByIdAndRemove(bidId)
      .then(bid => {
        res.json(bid);
        refundUser(bid.product, bid.user);
      })
      .catch(err => {
        console.log(err);
        res.status(404);
      });
  } else if (req.user.role === 'user') {
    // User can only delete his bid
    Bid.findOneAndRemove({
      _id: bidId,
      user: req.user._id
    })
      .then(result => {
        if (result) {
          res.json(result);
        } else {
          res.json('This user cannot delete this bid');
        }
      })
      .catch(err => {
        console.log(err);
      });
  }
};

exports.refundUser = refundUser;

// Delete all bids

exports.deleteAll = (req, res, next) => {
  Bid.deleteMany()
    .then(() => {
      res.json('Deleted all bids');
    })
    .catch(err => {
      console.log(err);
    });
};
