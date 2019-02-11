const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const express = require('express');
const users = express.Router();

let User = require('../models/User');
users.use(cors());

process.env.SECRET_KEY = 'secret';

exports.Register = (req, res) => {
  const userData = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
  };
  let newUser = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
  });

  User.findOne({
    email: req.body.email
  })
    .then(user => {
      if (!user) {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          userData.password = hash;
          User.create(userData)
            .then(user => {
              res.json({ status: user.email + ' Registered !' });
            })
            .catch(err => {
              res.send('error' + err);
            });
        });
      } else {
        res.json({ error: 'User already exists' });
      }
    })
    .catch(err => {
      res.send('error' + err);
    });
};

// bcrypt.getSalt(10, (err, salt) => {
//     bcrypt.hash(newUser.password, salt, (err, hash) => {
//       //console.log(newUser.password);
//       if (err) {
//         res.json(err);
//       }
//       newUser.password = hash;
//       //console.log(newUser.password);
//       newUser.save(err => {
//         if (err) {
//           res.json(err);
//           return;
//         } else {
//           req.flash('success', 'You are now registered and can log in !');
//           res.redirect('/auth/login');
//         }
//       });
//     });
//   });
