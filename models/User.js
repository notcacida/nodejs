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
  },
  phoneNumber: {
    type: String,
    required: false,
    default: '1234567890'
  },

  //token will exists only if the user request reset pass
  resetToken: String,
  resetTokenExpiration: Date
});

module.exports = mongoose.model('User', userSchema);
