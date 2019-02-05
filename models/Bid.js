const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const bidSchema = new Schema({
  amount: {
    type: Number,
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});
module.exports = mongoose.model('Bid', bidSchema);
