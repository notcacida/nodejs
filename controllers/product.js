const Product = require('../models/product');
const Bid = require('../models/Bid');
// const User = require('../models/User');

// ACTIONS

// Check requesting user: Only admin can add a product
// Add product
exports.addProduct = (req, res) => {
  if (req.user.role === 'admin') {
    const product = req.body;
    product.bid_price =
      Math.round((req.body.price * 0.02 + 0.00001) * 100) / 100;
    Product.addProduct(product, (err, book) => {
      if (err) throw err;
      res.json({ products: product });
    });
  } else {
    res.status(403).json({ error: 'Invalid credentials for adding a product' });
  }
};

// Get all products
exports.getAllProducts = (req, res, next) => {
  Product.getProducts((err, products) => {
    if (err) throw err;
    res.json({ products: products });
  });
};

// Get product
exports.getProductById = (req, res) => {
  Product.getProductById(req.params._id, (err, product) => {
    if (err) {
      res.sendStatus(404);
      throw err;
    }
    res.json({ products: product });
  });
};

// Update product
// Only admin can edit a product
exports.putProdById = (req, res, next) => {
  if (req.user.role === 'admin') {
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
        res.send({ products: product });
      })
      .catch(err => {
        console.log(err);
        res.sendStatus(404);
      });
  } else {
    res
      .status(403)
      .json({ error: 'Invalid credentials for editing a product' });
  }
};

// Get products of charity
exports.getProductsOfCharity = (req, res, next) => {
  const _id = req.params._id;
  Product.find({
    charity: _id
  })
    .then(products => {
      res.send({ products: products });
    })
    .catch(err => {
      console.log(err);
      res.sendStatus(404);
    });
};

// Refund users of bids deleted below
// let refundUser = require('./bid').refundUser;

// Delete bids associated with products deleted
let deleteBidsofProduct = _id => {
  Bid.deleteMany({
    product: _id
  })
    .then(result => {
      console.log('Deleted bids: ', result);
    })
    .catch(err => {
      console.log(err);
    });
};

// Delete product
// Only admin can delete a product
exports.deleteById = (req, res, next) => {
  if (req.user.role === 'admin') {
    const productId = req.params._id;
    Product.findByIdAndRemove(productId)
      .then(product => {
        deleteBidsofProduct(productId);
        res.json({ products: product });
      })
      .catch(err => {
        console.log(err);
        res.sendStatus(404);
      });
  } else {
    res
      .status(403)
      .json({ error: 'Invalid credentials for deleting a product' });
  }
};
