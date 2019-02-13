const Charity = require('../models/charity');
const Product = require('../models/product');
const Bid = require('../models/Bid');

// Add charity
// Check requesting user: only admin can add charities
exports.postCharity = (req, res) => {
  if (req.user.role === 'admin') {
    const charity = req.body;
    Charity.addCharity(charity, (err, charity) => {
      if (err) {
        res.sendStatus(400);
      } else res.json({ charities: charity });
    });
  } else {
    res.status(403).json({ error: 'Invalid credentials for adding a charity' });
  }
};

// Get all charities
exports.getCharities = (req, res) => {
  Charity.getCharities((err, charities) => {
    if (err) {
      res.status(500).json({ errors: 'Something went wrong.' });
    } else res.json({ charities: charities });
  });
};

// Get one charity
exports.getCharityPerId = (req, res) => {
  Charity.getCharityById(req.params._id, (err, charity) => {
    if (err) {
      res.status(404).json({ errors: 'Charity not found.' });
    } else res.json({ charities: charity });
  });
};

// Edit charity
// Only admin can edit a charity
exports.putCharityById = (req, res) => {
  if (req.user.role === 'admin') {
    const id = req.params._id;
    const uName = req.body.name;
    const uDescription = req.body.description;
    Charity.findById(id)
      .then(charity => {
        charity.name = uName || charity.name;
        charity.description = uDescription || charity.description;
        charity.save();
        return charity;
      })
      .then(charity => {
        res.send({ charities: charity });
      })
      .catch(() => {
        res.status(404).json({ errors: 'Charity not found.' });
      });
  } else {
    res
      .status(403)
      .json({ error: 'Invalid credentials for editing a charity' });
  }
};

// Logical order of delete is either 4-1-2-3 or 4-1-3-2

// 4. Refund users of bids deleted
// let refundUser = require('./bid').refundUser;

// 3. Delete bids associated with the products that were removed with charity
let deleteBidsOfCharity = charityId => {
  Bid.deleteMany({
    charity: charityId
  })
    .then(result => {
      console.log(result);
    })
    .catch(err => {
      console.log(err);
    });
};

// 2. Delete products associated with the deleted charity
let deleteProductsOfCharity = charityId => {
  Product.deleteMany({
    charity: charityId
  })
    .then(result => {
      console.log(result);
    })
    .catch(err => {
      console.log(err);
    });
};

// 1. Delete charity
// Only admin can delete a charity
exports.deleteCharity = (req, res, next) => {
  if (req.user.role === 'admin') {
    const charityId = req.params.charityId;
    Charity.findByIdAndRemove(charityId)
      .then(charity => {
        deleteBidsOfCharity(charityId);
        deleteProductsOfCharity(charityId);
        res.json({ charities: charity });
      })
      .catch(() => {
        res.status(404).json({ errors: 'Charity not found.' });
      });
  } else {
    res
      .status(403)
      .json({ error: 'Invalid credentials for deleting a charity' });
  }
};
