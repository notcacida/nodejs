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
  create_date: {
    type: Date,
    default: Date.now
  }
});

var Charity = (module.exports = mongoose.model('Charity', schema));
module.exports = mongoose.model('Charity', schema);

//get products

module.exports.getCharities = (callback, limit) => {
  Charity.find(callback).limit(limit);
};

//get product by id

module.exports.getCharityById = (_id, callback) => {
  Charity.findById(_id, callback);
};

//add prodocut
module.exports.addCharity = (product, callback) => {
  Charity.create(product, callback);
};

//update product
module.exports.updateCharity = (id, charity, options, callback) => {
  var query = {
    _id: id
  };

  var update = {
    name: charity.name,
    description: charity.description,
    img_url: charity.img_url,
    products: charity.products
  };

  Charity.findOneAndUpdate(query, update, options, callback);
};

//remove product
module.exports.removeCharity = (id, callback) => {
  var query = {
    _id: id
  };

  Charity.deleteOne(query, callback);
};

// comment to expose this file to heroku GIT status
