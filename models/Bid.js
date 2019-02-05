const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const bidSchema = new Schema({
  amount: {
    type: Number,
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  // Status of bid : 1 = open bid   0 = closed bid
  status: {
    type: Boolean,
    default: 1
  }
});
module.exports = mongoose.model('Bid', bidSchema);
