const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const invalidTokenSchema = new Schema({
  token: {
    type: String,
    required: true
  }
});
module.exports = mongoose.model('Invalid_Token', invalidTokenSchema);
