const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },

  role: {
    type: String,
    required: false,
    default: 'user'
  },
  wallet: {
    type: Number,
    required: false,
    default: 0
  }
});

module.exports = mongoose.model('User', userSchema);
