const User = require('../models/User');

module.exports = (req, res, next) => {
  let usersToBeRefunded = req.usersToRefund;
  console.log('users to be refunded are: ', usersToBeRefunded);
  for (let i = 0; i < usersToBeRefunded.length; i++) {
    // Refund each user here
    User.findOne({
      _id: usersToBeRefunded[i].user
    })
      .then(user => {
        user.wallet += usersToBeRefunded[i].amount;
        user.save();
      })
      .catch(err => {
        console.log(err);
      });
  }
  next();
};
