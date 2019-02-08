const Charity = require('../models/charity');
const Product = require('../models/product');
const Bid = require('../models/Bid');

exports.getCharities = (req, res) => {
  Charity.getCharities((err, charities) => {
    if (err) throw err;
    res.json(charities);
  });
};

exports.getCharityPerId = (req, res) => {
  Charity.getCharityById(req.params._id, (err, charity) => {
    if (err) {
      res.status(404).send('404 Not found');
      throw err;
    }
    res.json(charity);
  });
};

exports.postCharity = (req, res) => {
  const charity = req.body;
  Charity.addCharity(charity, (err, charity) => {
    if (err) throw err;
    res.json(charity);
  });
};

exports.putCharityById = (req, res) => {
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
      res.send(charity);
    })
    .catch(err => {
      console.log(err);
      res.status(404).send('404 Not found');
    });
};

// Logical order of delete is either 1-2-3 or 1-3-2

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
exports.deleteCharity = (req, res, next) => {
  const charityId = req.params.charityId;
  Charity.findByIdAndRemove(charityId)
    .then(charity => {
      deleteBidsOfCharity(charityId);
      deleteProductsOfCharity(charityId);
      res.json(charity);
    })
    .catch(err => {
      console.log(err);
      res.status(404).send('404 Not found');
    });
};
