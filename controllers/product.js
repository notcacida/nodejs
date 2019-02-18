const Product = require('../models/product');
const Bid = require('../models/Bid');
const User = require('../models/User');

// ACTIONS

// Check requesting user: Only admin can add a product
// Add product
exports.addProduct = (req, res) => {
  if (req.user.role === 'admin') {
    const product = req.body;

    // CHANGE CONTEST PRICING RULES HERE
    // Bid price set by default as 2% of product's price
    product.bid_price =
      Math.round((req.body.price * 0.02 + 0.00001) * 100) / 100;
    // Reserve amount set by default as 3X the product's price
    product.reserve_amount = req.body.price * 3;

    Product.addProduct(product, (err, book) => {
      if (err) {
        res.sendStatus(400);
      } else res.json({ products: product });
    });
  } else {
    res.status(403).json({ error: 'Invalid credentials for adding a product' });
  }
};

// Get all products
exports.getAllProducts = (req, res, next) => {
  Product.getProducts((err, products) => {
    if (err) {
      res.status(500).json({ errors: 'Something went wrong.' });
    } else res.json({ products: products });
  });
};

// Get product
exports.getProductById = (req, res) => {
  Product.getProductById(req.params._id, (err, product) => {
    if (err) {
      res.status(404).json({ errors: 'Product not found.' });
    } else res.json({ products: product });
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
            Math.round((product.price * 0.02 + 0.00001) * 100) / 100),
          (product.reserve_amount = uPrice * 3 || product.price * 3);
        product.save();
        res.send({ products: product });
      })
      .catch(() => {
        res.status(404).json({ errors: 'Product not found.' });
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
    .catch(() => {
      res.status(404).json({ errors: 'Charity not found.' });
    });
};

// Delete product
// Order is :
// 1. Find users who bidded on this product, so they can be refunded ->
// 2. Refund them ->
// 3. Delete product ->
// 4. Delete bids associated

// 4.
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

// Only admin can delete a product
exports.deleteById = (req, res, next) => {
  if (req.user.role === 'admin') {
    const productId = req.params._id;
    // 3.
    Product.findByIdAndRemove(productId)
      .then(product => {
        // 4.
        deleteBidsofProduct(productId);
        res.json({ products: product });
      })
      .catch(() => {
        res.status(404).json({ errors: 'Product not found.' });
      });
  } else {
    res
      .status(403)
      .json({ error: 'Invalid credentials for deleting a product' });
  }
};

// 1.
exports.findUsersToRefund = (req, res, next) => {
  let usersToRefund = [];
  const productId = req.params._id;
  console.log('refund users who bidded on: ', productId);
  Bid.find({
    product: productId
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
// Done in products ROUTES using module from ../util
