const User = require('../models/User');
const Bid = require('../models/Bid');

// ACTIONS

// Add a user
exports.addUser = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const name = req.body.name;
  const role = req.body.role;
  const user = new User({
    email: email,
    password: password,
    name: name,
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

// Get all users
exports.getAllUsers = (req, res, next) => {
  User.find()
    .then(users => {
      res.send(users);
    })
    .catch(err => {
      console.log(err);
    });
};

// Get one user
exports.getUser = (req, res, next) => {
  const userId = req.params.userId;
  User.findById(userId)
    .then(user => {
      res.send(user);
    })
    .catch(err => {
      console.log(err);
    });
};

// Edit user
exports.editUser = (req, res, next) => {
  const updatedEmail = req.body.email;
  const updatedPassword = req.body.password;
  const updatedName = req.body.name;
  const updatedRole = req.body.role;
  const userId = req.params.userId;
  User.findById(userId)
    .then(user => {
      user.email = updatedEmail || user.email;
      user.password = updatedPassword || user.password;
      user.name = updatedName || user.name;
      user.role = updatedRole || user.role;
      user.save();
      return user;
    })
    .then(user => {
      console.log(user);
    })
    .catch(err => {
      console.log(err);
    });
};

// when we delete a user, we also want to delete his bids
let deleteBidsOfUser = userId => {
  Bid.deleteMany({
    user: userId
  })
    .then()
    .catch(err => {
      console.log(err);
    });
};

// Delete user
exports.deleteUser = (req, res, next) => {
  const userId = req.params.userId;
  User.findByIdAndRemove(userId)
    .then(user => {
      console.log('Deleted user: ', user);
      deleteBidsOfUser(user._id);
    })
    .catch(err => {
      console.log(err);
    });
};
