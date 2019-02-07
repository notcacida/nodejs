const Product = require('../models/product');

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
    if (err) throw err;
    res.json(product);
  });
};

// Add product
exports.addProduct = (req, res) => {
  var product = req.body;
  product.bid_price = req.body.price * 0.02;
  Product.addProduct(product, (err, book) => {
    if (err) throw err;
    res.json(product);
  });
};

// Update product
exports.putProdById = (req, res) => {
  var id = req.params._id;
  var product = req.body;
  product.bid_price = req.body.price * 0.02;
  Product.updateProduct(id, product, {}, (err, product) => {
    if (err) throw err;
    res.json(product);
  });
};

// Delete product
exports.deleteById = (req, res) => {
  var id = req.params._id;
  Product.removeProduct(req.params._id, (err, product) => {
    if (err) throw err;
    res.json(product);
  });
};
