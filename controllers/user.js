const User = require('../models/User');
const Bid = require('../models/Bid');

// ACTIONS

// Add a user
exports.addUser = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const name = req.body.name;
  const role = req.body.role;
  const wallet = req.body.wallet;
  const user = new User({
    email: email,
    password: password,
    name: name,
    role: role,
    wallet: wallet
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
      res.status(404).send('404 Not found');
    });
};

// Edit user
exports.editUser = (req, res, next) => {
  const updatedEmail = req.body.email;
  const updatedPassword = req.body.password;
  const updatedName = req.body.name;
  const updatedRole = req.body.role;
  const userId = req.params.userId;
  const updatedWallet = req.params.wallet;

  User.findById(userId)
    .then(user => {
      user.email = updatedEmail || user.email;
      user.password = updatedPassword || user.password;
      user.name = updatedName || user.name;
      user.role = updatedRole || user.role;
      user.wallet = updatedWallet || user.wallet;
      user.save();
      return user;
    })
    .then(user => {
      res.send(user);
    })
    .catch(err => {
      console.log(err);
      res.status(404).send('404 Not found');
    });
};

// Delete bids associated with user
let deleteBidsOfUser = userId => {
  Bid.deleteMany({
    user: userId
  })
    .then(result => {
      console.log(result);
    })
    .catch(err => {
      console.log(err);
    });
};

// Delete user
exports.deleteUser = (req, res, next) => {
  const userId = req.params.userId;
  User.findByIdAndRemove(userId)
    .then(user => {
      deleteBidsOfUser(user._id);
      res.send(user);
    })
    .catch(err => {
      console.log(err);
      res.status(404).send('404 Not found');
    });
};

//add money to wallet
exports.addMoney = (req, res, next) => {
  const userId = req.params.userId;
  const addition = 100;
  User.findById(userId)
    .then(user => {
      user.wallet = user.wallet + addition;
      user.save();
      res.json(user);
    })
    .catch(err => {
      console.log(err);
    });
};
