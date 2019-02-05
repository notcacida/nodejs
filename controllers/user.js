const User = require('../models/User');

// ACTIONS

// addUser
exports.addUser = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const name = req.body.name;
  const bids = [];
  const role = req.body.role;
  const user = new User({
    email: email,
    password: password,
    name: name,
    bids: bids,
    role: role
  });
  user
    .save()
    .then(result => {
      res.send(result);
    })
    .catch(err => {
      console.log(err);
    });
};

// getAllUsers

// getUser

// editUser

// deleteUser
