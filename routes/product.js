var express = require('express');
var router = express.Router();

const verifyToken = require('../util/verifyToken');
const verifyLoggedIn = require('../util/VerifyLoggedIn');

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
router.put('/:_id', verifyToken, verifyLoggedIn, productController.putProdById);

// Delete product
router.delete(
  '/:_id',
  verifyToken,
  verifyLoggedIn,
  productController.deleteById
);

module.exports = router;
