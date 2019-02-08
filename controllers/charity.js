const Charity = require('../models/charity');
const Product = require('../models/product');

exports.getCharities = (req, res) => {
  Charity.getCharities((err, charities) => {
    if (err) throw err;
    res.json(charities);
  });
};

exports.getCharityPerId = (req, res) => {
  Charity.getCharityById(req.params._id, (err, charity) => {
    if (err) throw err;
    res.json(charity);
  });
};

exports.postCharity = (req, res) => {
  var charity = req.body;
  Charity.addCharity(charity, (err, charity) => {
    if (err) throw err;
    res.json(charity);
  });
};

exports.putCharityById = (req, res) => {
  var id = req.params._id;
  var charity = req.body;
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
      res.json(err);
    });
};

// Delete bids associated with the products that were removed with charity

// Delete products associated with the deleted charity
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

// Delete charity
exports.deleteCharity = (req, res, next) => {
  const charityId = req.params.charityId;
  Charity.findByIdAndRemove(charityId)
    .then(charity => {
      deleteProductsOfCharity(charityId);
      res.json(charity);
    })
    .catch(err => {
      res.json(err);
    });
};
