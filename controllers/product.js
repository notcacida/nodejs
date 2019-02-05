const Product = require('../models/product');
exports.getAllProducts = (req, res, next) => {
  Product.getProducts((err, products) => {
    if (err) throw err;
    //res.send(products);
    res.json(products);
  });
};

exports.getProductById = (req, res) => {
  Product.getProductById(req.params._id, (err, product) => {
    if (err) throw err;
    res.json(product);
  });
};
exports.addProduct = (req, res) => {
  var product = req.body;
  Product.addProduct(product, (err, book) => {
    if (err) throw err;
    res.json(product);
  });
};

exports.putProdById = (req, res) => {
  var id = req.params._id;
  var product = req.body;
  Product.updateProduct(id, product, {}, (err, product) => {
    if (err) throw err;
    res.json(product);
  });
};

exports.deleteById = (req, res) => {
  var id = req.params._id;
  Product.removeProduct(req.params._id, (err, product) => {
    if (err) throw err;
    res.json(product);
  });
};
