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
  bid_price: {
    type: Number,
    required: true
  },
  charity: {
    type: Schema.Types.ObjectId,
    ref: 'Charity',
    required: true
  },
  create_date: {
    type: Date,
    default: Date.now
  },
  end_date: {
    type: Date,
    default: new Date(+new Date() + 7 * 24 * 60 * 60 * 1000)
  }
});

var Product = (module.exports = mongoose.model('Product', schema));
module.exports = mongoose.model('Product', schema);

//get products

module.exports.getProducts = (callback, limit) => {
  Product.find(callback).limit(limit);
};

//get product by id

module.exports.getProductById = (_id, callback) => {
  Product.findById(_id, callback);
};

//add product
module.exports.addProduct = (product, callback) => {
  Product.create(product, callback);
};

//update product
module.exports.updateProduct = (id, product, options, callback) => {
  var query = {
    _id: id
  };

  var update = {
    // name: product.name,
    // description: product.description,
    // img_url: product.img_url,
    // price: product.price,
    // bid_price: product.bid_price,
    // charity: product.charity
    name: req.body.name || product.name,
    description: req.body.description || product.description,
    img_url: req.body.img_url || product.img_url,
    price: req.body.price || product.price,
    charity: req.body.charity || product.charity
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
