var express = require('express');
var router = express.Router();

var productController = require('../controllers/product');

// Add product
router.post('/', productController.addProduct);
/* Get all products */
router.get('/', productController.getAllProducts);
// Get products of charity
router.get('/charity/:_id', productController.getProductsOfCharity);
// Get one product
router.get('/:_id', productController.getProductById);
// Update product
router.put('/:_id', productController.putProdById);

// Delete product
router.delete(
  '/:_id',
  productController.refundUsers,
  productController.deleteById
);

module.exports = router;
