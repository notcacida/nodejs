const Product = require('../models/product');
const Bid = require('../models/Bid');

// ACTIONS

// Get all products
exports.getAllProducts = (req, res, next) => {
  Product.getProducts((err, products) => {
    if (err) throw err;
    res.json(products);
  });
};

// Get product
exports.getProductById = (req, res) => {
  Product.getProductById(req.params._id, (err, product) => {
    if (err) {
      res.status(404).send('404 Not found');
      throw err;
    }
    res.json(product);
  });
};

// Add product
exports.addProduct = (req, res) => {
  const product = req.body;
  product.bid_price = Math.round((req.body.price * 0.02 + 0.00001) * 100) / 100;
  Product.addProduct(product, (err, book) => {
    if (err) throw err;
    res.json(product);
  });
};

// Update product
exports.putProdById = (req, res, next) => {
  const id = req.params._id;
  const uName = req.body.name;
  const uDescription = req.body.description;
  const uImg_url = req.body.img_url;
  const uPrice = req.body.price;
  const uCharity = req.body.charity;
  Product.findById(id)
    .then(product => {
      (product.name = uName || product.name),
        (product.description = uDescription || product.description),
        (product.img_url = uImg_url || product.img_url),
        (product.price = uPrice || product.price),
        (product.charity = uCharity || product.charity),
        (product.bid_price =
          Math.round((uPrice * 0.02 + 0.00001) * 100) / 100 ||
          Math.round((product.price * 0.02 + 0.00001) * 100) / 100);
      product.save();
      return product;
    })
    .then(product => {
      res.send(product);
    })
    .catch(err => {
      console.log(err);
      res.status(404).send('404 Not found');
    });
};

// Get products of charity
exports.getProductsOfCharity = (req, res, next) => {
  const _id = req.params._id;
  Product.find({
    charity: _id
  })
    .then(result => {
      res.send(result);
    })
    .catch(err => {
      console.log(err);
      res.status(404).send('404 Not found');
    });
};

// Delete bids associated with products deleted
let deleteBidsofProduct = _id => {
  Bid.deleteMany({
    product: _id
  })
    .then(result => {
      console.log(result);
    })
    .catch(err => {
      console.log(err);
    });
};

// Delete product
exports.deleteById = (req, res, next) => {
  const id = req.params._id;
  Product.findByIdAndRemove(id)
    .then(product => {
      deleteBidsofProduct(id);
      res.json(product);
    })
    .catch(err => {
      console.log(err);
      res.status(404).send('404 Not found');
    });
};
