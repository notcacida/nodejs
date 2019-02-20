const mongoose = require('mongoose');
const { validateBody, schemas } = require('../util/helpers');
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
  img_url: {
    type: String,
    default: 'https://i.imgur.com/tP72BMI.png'
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
  //token will exists only if the user request reset pass
  resetToken: String,
  resetTokenExpiration: Date
});

userSchema.pre('save', async function(next) {
  try {
    validateBody(schemas.authSchema);
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model('User', userSchema);
