var express = require('express');
var router = express.Router();

var productController = require('../controllers/product');
/* Get all products */
router.get('/', productController.getAllProducts);

router.get('/:_id', productController.getProductById);

router.post('/', productController.addProduct);

router.put('/:_id', productController.putProdById);

router.delete('/:_id', productController.deleteById);

//get products from one charity

router.get('/charity/:_id', productController.getProductsOfCharity);

module.exports = router;
