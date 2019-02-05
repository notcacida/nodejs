var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
  name: {
    type: String,
    required: true
  },

  description: {
    type: String,
    required: true
  },

  img_url: {
    type: String,
    required: true
  },

  price: {
    type: Number,
    required: true
  },

  charity: {
    type: Schema.ObjectId,
    ref: 'charity'
  },
  create_date: {
    type: Date,
    default: Date.now
  }
});

var Product = (module.exports = mongoose.model('Product', schema));
module.exports = mongoose.model('product', schema);

//get products

module.exports.getProducts = (callback, limit) => {
  Product.find(callback).limit(limit);
};

//get product by id

module.exports.getProductById = (_id, callback) => {
  Product.findById(_id, callback);
};

//add prodocut
module.exports.addProduct = (product, callback) => {
  Product.create(product, callback);
};

//update product
module.exports.updateProduct = (id, product, options, callback) => {
  var query = {
    _id: id
  };

  var update = {
    name: product.name,
    description: product.description,
    img_url: product.img_url,
    price: product.price,
    charity: product.charity
  };

  Product.findOneAndUpdate(query, update, options, callback);
};

//remove product
module.exports.removeProduct = (id, callback) => {
  var query = {
    _id: id
  };

  Product.deleteOne(query, callback);
};
