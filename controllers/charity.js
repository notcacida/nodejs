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
    const uImage = req.body.img_url;

    Charity.findById(id)
      .then(charity => {
        charity.name = uName || charity.name;
        charity.description = uDescription || charity.description;
        charity.img_url = uImage || charity.img_url;
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

// Delete charity
// Order is :
// 1. Find users who bidded with this charity, so they can be refunded ->
// 2. Refund them ->
// 3. Delete charity ->
// 4. Delete products associated with charity ->
// 5. Delete bids associated with deleted products

// 5.
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

// 4.
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

// 3.
// Only admin can delete a charity
exports.deleteCharity = (req, res, next) => {
  if (req.user.role === 'admin') {
    const charityId = req.params.charityId;
    Charity.findByIdAndRemove(charityId)
      .then(charity => {
        // 5.
        deleteBidsOfCharity(charityId);
        // 4.
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

// 1.
exports.findUsersToRefund = (req, res, next) => {
  let usersToRefund = [];
  const charityId = req.params._id;
  console.log('refund users who bidded on charity: ', charityId);
  Bid.find({
    charity: charityId
  })
    .then(bids => {
      console.log('bids of product to delete are ', bids);
      for (let i = 0; i < bids.length; i++) {
        usersToRefund.push({ user: bids[i].user, amount: bids[i].bidAmount });
      }
      req.usersToRefund = usersToRefund;
      next();
    })
    .catch(err => {
      console.log(err);
    });
};

// 2.
// Done in charities ROUTES using module from ../util
