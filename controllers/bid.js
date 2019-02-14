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
        res
          .status(403)
          .json({ error: 'User does not have enough credit to bid.' });
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
  // Check requesting user
  // This 'if' check is not needed actually, app never reacher addBid
  // if there is no Authentification header on request, therefore no requesting user
  if (typeof req.user === 'undefined') {
    res.sendStatus(403).json({ error: 'Guest can not bid' });
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
    historyBid.save().catch(() => {
      res.status(500).json({ errors: 'Something went wrong.' });
    });

    // Add bid to regular collection
    bid
      .save()
      .then(bid => {
        checkoutProduct(bid.product, userThatMadeBid);
        res.json({ bids: bid });
      })
      .catch(() => {
        res.status(500).json({ errors: 'Something went wrong.' });
      });
  }
};

// Get all bids
exports.getAllBids = (req, res, next) => {
  // If user is not logged in, don't show bids
  // req.user is defined only when request has a TOKEN attached.
  if (typeof req.user === 'undefined') {
    res.status(403).json({ error: 'Guest can not see all bids' });
  } else if (req.user.role === 'admin') {
    // If user is admin, show all bids
    Bid.find()
      .then(bids => {
        res.json({ bids: bids });
      })
      .catch(() => {
        res.status(500).json({ errors: 'Something went wrong.' });
      });
  } else if (req.user.role === 'user') {
    // If user is user, show his bids
    Bid.find({
      user: req.user._id
    })
      .then(bids => {
        res.json({ bids: bids });
      })
      .catch(() => {
        res.status(500).json({ errors: 'Something went wrong.' });
      });
  }
};

// Get historical bids
// If user is not admin, don't show historical bids
exports.getHistoricalBids = (req, res, next) => {
  if (typeof req.user === 'undefined') {
    res.status(403).json({ error: 'Guest can not see historical bids' });
  } else if (req.user.role === 'admin') {
    BidHistorical.find()
      .then(bids => {
        res.json({ bids: bids });
      })
      .catch(() => {
        res.status(500).json({ errors: 'Something went wrong.' });
      });
  } else {
    res.status(403).json({ error: 'You do not have the required credentials' });
  }
};

// Get bids of user
exports.getBidsOfUser = (req, res, next) => {
  let showBids = () => {
    Bid.find({
      user: userId
    })
      .then(bids => {
        res.json({ bids: bids });
      })
      .catch(() => {
        res.status(404).json({ errors: 'User not found.' });
      });
  };
  // Guest, don't show anything
  // Admin, show anything
  // Regular user, only show his bids if he wants them
  const userId = req.params.userId;
  if (typeof req.user === 'undefined') {
    res.status(403).json({ error: 'Please login first' });
  } else if (req.user.role === 'admin') {
    showBids();
  } else if (req.user.role === 'user') {
    if (userId.toString() !== req.user._id.toString()) {
      res.status(403).json({ error: 'You can only see your own bids!' });
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
    res.status(403).json({ error: 'Guest cannot see bids on a product' });
  } else if (req.user.role === 'admin') {
    const prodId = req.params.productId;
    Bid.find({
      product: prodId
    })
      .then(bids => {
        res.json({ bids: bids });
      })
      .catch(() => {
        res.status(404).json({ errors: 'Product not found.' });
      });
  } else if (req.user.role === 'user') {
    res
      .status(403)
      .json({ error: 'Regular users cannot see all bids on a product' });
  }
};

// Get one bid

// Guest, don't show anything
// Regular user, get bid if it belongs to user
// Admin, show everything
exports.getBid = (req, res, next) => {
  const bidId = req.params.bidId;
  if (typeof req.user === 'undefined') {
    res.status(403).json({ error: 'Guest cannot see bids' });
  } else if (req.user.role === 'admin') {
    Bid.findById(bidId)
      .then(bid => {
        res.json({ bids: bid });
      })
      .catch(() => {
        res.status(404).json({ errors: 'Bid not found.' });
      });
  } else if (req.user.role === 'user') {
    Bid.find({
      _id: bidId,
      user: req.user._id
    })
      .then(bid => {
        res.json({ bids: bid });
      })
      .catch(() => {
        res.status(404).json({ errors: 'Bid not found.' });
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
    res.status(403).json({ error: 'Guest cannot delete bids' });
  } else if (req.user.role === 'admin') {
    // Admin can delete any bid
    Bid.findByIdAndRemove(bidId)
      .then(bid => {
        res.json({ bids: bid });
        refundUser(bid.product, bid.user);
      })
      .catch(() => {
        res.status(404).json({ errors: 'Bid not found.' });
      });
  } else if (req.user.role === 'user') {
    // User can only delete his bid
    Bid.findOneAndRemove({
      _id: bidId,
      user: req.user._id
    })
      .then(result => {
        if (result) {
          res.json({ bids: result });
        } else {
          res.status(403).json({ error: 'This user cannot delete this bid' });
        }
      })
      .catch(() => {
        res.status(404).json({ errors: 'Bid not found.' });
      });
  }
};

exports.refundUser = refundUser;

// Delete all bids
// Only admin can delete all bids
exports.deleteAll = (req, res, next) => {
  if (req.user.role === 'admin') {
    Bid.deleteMany()
      .then(() => {
        res.json('Deleted all bids');
      })
      .catch(err => {
        console.log(err);
      });
  } else {
    res
      .status(403)
      .json({ error: 'Credentials invalid for deleting all bids' });
  }
};
