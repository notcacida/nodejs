const Bid = require('../models/Bid');

// This middleware checks if a product has bids on it
// If the product has bids on it, we can't allow editing the products' price

module.exports = (req, res, next) => {
  const id = req.params._id;
  Bid.findOne({
    product: id
  })
    .then(bids => {
      console.log('Bids on this product are: ', bids);
      if (bids) {
        req.productHasBids = true;
        next();
      } else {
        req.productHasBids = false;
        next();
      }
    })
    .catch(err => {
      console.log(err);
    });
};
