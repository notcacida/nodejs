const bcrypt = require('bcryptjs');

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
  // Check requesting user: only admin can add other users on this route: POST on /users
  // Other route for adding users (/auth/register) will of course, not be protected.
  if (req.user.role === 'admin') {
    bcrypt.hash(password, 10, (err, hash) => {
      const user = new User({
        email: email,
        password: hash,
        name: name,
        role: role,
        wallet: wallet
      });
      user
        .save()
        .then(result => {
          res.json({ users: result });
        })
        .catch(err => {
          res.status(500).json({ errors: 'Something went wrong.' });
        });
    });
  } else {
    res.status(403).json({ error: 'Invalid credentials for adding users' });
  }
};

// Get all users
// Only admin can see all users
// Regular user can see his own user
// Guest can't see anybody
exports.getAllUsers = (req, res, next) => {
  if (typeof req.user === 'undefined') {
    res.status(403).json({ error: 'Guest can not see all users' });
  } else if (req.user.role === 'admin') {
    User.find()
      .then(users => {
        res.json({ users: users });
      })
      .catch(() => {
        res.status(500).json({ errors: 'Something went wrong.' });
      });
  } else if (req.user.role === 'user') {
    User.find({
      _id: req.user._id
    })
      .then(users => {
        res.json({ users: users });
      })
      .catch(() => {
        res.status(500).json({ errors: 'Something went wrong.' });
      });
  }
};

// Get one user
// Admin can get any user
// User can only get his own user
// Guest can't get anything
exports.getUser = (req, res, next) => {
  const userId = req.params.userId;
  let showUser = () => {
    User.findById(userId)
      .then(user => {
        res.json({ users: user });
      })
      .catch(() => {
        res.status(404).json({ errors: 'User not found.' });
      });
  };
  if (typeof req.user === 'undefined') {
    res.json({ error: 'Please login first' });
  } else if (req.user.role === 'admin') {
    showUser();
  } else if (req.user.role === 'user') {
    if (userId.toString() !== req.user._id.toString()) {
      res.status(403).json({ error: 'You can only see your own user!' });
    } else {
      showUser();
    }
  }
};

// Edit user
// Admin can edit any user
// User can only edit his own user

exports.editUser = (req, res, next) => {
  // ID
  const userId = req.params.userId;
  // Properties
  const updatedEmail = req.body.email;
  const updatedPassword = req.body.password;
  const updatedName = req.body.name;
  const updatedRole = req.body.role;
  const updatedWallet = req.body.wallet;

  if (typeof req.user === 'undefined') {
    res.status(403).json({ error: 'Guest cannot edit users' });
  } else if (req.user.role === 'admin') {
    User.findById(userId)
      .then(user => {
        // Aux function, used when updating
        let updateUserInfo = () => {
          user.email = updatedEmail || user.email;
          user.name = updatedName || user.name;
          user.role = updatedRole || user.role;
          user.wallet = updatedWallet || user.wallet;
        };
        // IF admin gave a new password,
        // create a hashed value of the updated password
        // ELSE do the update without a new password
        if (typeof updatedPassword !== 'undefined') {
          bcrypt.hash(updatedPassword, 10, (err, hash) => {
            user.password = hash;
            updateUserInfo();
            user.save();
            res.json({ users: user });
          });
        } else {
          updateUserInfo();
          user.save();
          res.json({ users: user });
        }
      })
      .catch(() => {
        res.status(404).json({ errors: 'User not found.' });
      });
  } else if (req.user.role === 'user') {
    if (req.user._id.toString() !== userId.toString()) {
      res.status(403).json({ error: 'You can only edit your own user' });
    } else {
      // User edits his own user, can edit his email, password & name
      User.findById(userId)
        .then(user => {
          // Aux function, used when updating
          let updateUserInfo = () => {
            user.email = updatedEmail || user.email;
            user.name = updatedName || user.name;
          };
          // IF user gave a new password,
          // create a hashed value of the updated password
          // ELSE do the update without a new password
          if (typeof updatedPassword !== 'undefined') {
            bcrypt.hash(updatedPassword, 10, (err, hash) => {
              user.password = hash;
              updateUserInfo();
              user.save();
              res.json({ users: user });
            });
          } else {
            updateUserInfo();
            user.save();
            res.json({ users: user });
          }
        })
        .catch(() => {
          res.status(404).json({ errors: 'User not found.' });
        });
    }
  } else {
    res.status(403).json({ error: 'Invalid credentials to edit a user' });
  }
};

// Delete bids associated with user
let deleteBidsOfUser = userId => {
  Bid.deleteMany({
    user: userId
  })
    .then(result => {
      console.log('Bids deleted', result);
    })
    .catch(err => {
      console.log(err);
    });
};

// Delete user
// Only admin can delete users
exports.deleteUser = (req, res, next) => {
  const userId = req.params.userId;
  if (typeof req.user === 'undefined') {
    res.status(403).json({ error: 'Guest cannot delete users' });
  } else if (req.user.role === 'admin') {
    User.findByIdAndRemove(userId)
      .then(user => {
        deleteBidsOfUser(user._id);
        res.json({ users: user });
      })
      .catch(() => {
        res.status(404).json({ errors: 'User not found.' });
      });
  } else {
    res
      .status(403)
      .json({ error: 'You do not have the credentials to delete users' });
  }
  // We may allow users to delete their own account, but it's OK sans this feature
};

// Add money to wallet
// Only admin can add funds to wallets

exports.addMoney = (req, res, next) => {
  if (typeof req.user === 'undefined') {
    res.status(403).json({ error: 'Guest cannot add to wallet' });
  } else if (req.user.role === 'user') {
    res.status(403).json({ error: 'Users cannot add to wallet' });
  } else if (req.user.role === 'admin') {
    const userId = req.params.userId;
    const addition = 100;
    User.findById(userId)
      .then(user => {
        user.wallet = user.wallet + addition;
        user.save();
        res.json({ users: user });
      })
      .catch(() => {
        res.status(404).json({ errors: 'User not found.' });
      });
  }
};
