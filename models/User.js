const mongoose = require('mongoose');
const { validateBody, schemas } = require('../util/helpers');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  method: {
    type: String,
    enum: ['local', 'google', 'facebook'],
    required: true
  },
  local: {
    email: {
      type: String,
      required: false
    },
    password: {
      type: String,
      required: false
    },
    name: {
      type: String,
      required: false
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
    phoneNumber: {
      type: String,
      required: false,
      default: '1234567890'
    },

    //token will exists only if the user request reset pass
    resetToken: String,
    resetTokenExpiration: Date
  },
  google: {
    //the id the user have in google server
    id: {
      type: String
    },
    email: {
      type: String,
      lowercase: true
    }
  },

  facebook: {
    id: {
      type: String
    },
    email: {
      type: String,
      lowercase: true
    }
  },
  //token will exists only if the user request reset pass
  resetToken: String,
  resetTokenExpiration: Date
});

userSchema.pre('save', async function(next) {
  if (this.local.method === 'local') {
    try {
      validateBody(schemas.authSchema);
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

module.exports = mongoose.model('User', userSchema);
