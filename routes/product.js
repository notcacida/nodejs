var express = require('express');
var router = express.Router();

const verifyToken = require('../util/verifyToken');
const verifyLoggedIn = require('../util/verifyLoggedIn');
const refundUsers = require('../util/refundUsers');
const checkProductForBids = require('../util/checkProductForBids');

var productController = require('../controllers/product');

// Add product
// Verify token will only let user continue if an Authorization header is present on the request
// Otherwise get a 403
// Type of user making request is further checked in controller
router.post('/', verifyToken, verifyLoggedIn, productController.addProduct);

/* Get all products */
router.get('/', productController.getAllProducts);

// Get products of charity
router.get('/charity/:_id', productController.getProductsOfCharity);

// Get one product
router.get('/:_id', productController.getProductById);

// Update product
// checkProductForBids checks if a product has bids on it
// If the product has bids on it, we can't allow editing the products' price
router.put(
  '/:_id',
  verifyToken,
  verifyLoggedIn,
  checkProductForBids,
  productController.putProdById
);

// Delete product
router.delete(
  '/:_id',
  verifyToken,
  verifyLoggedIn,
  productController.findUsersToRefund,
  refundUsers,
  productController.deleteById
);

module.exports = router;
