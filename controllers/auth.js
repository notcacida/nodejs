const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const express = require('express');
const users = express.Router();

let User = require('../models/User');
users.use(cors());

process.env.SECRET_KEY = 'secret';

let _validateEmail = email => {
  let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

// ACTIONS

// Register
exports.Register = (req, res) => {
  const userData = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
  };
  if (_validateEmail(req.body.email)) {
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
          res.status(409).json({ error: 'User already exists' });
        }
      })
      .catch(err => {
        res.send('error' + err);
      });
  } else {
    res.status(400).json({ error: 'Email no good' });
  }
};

exports.Login = (req, res, next) => {
  User.findOne({
    email: req.body.email
  })
    .then(user => {
      if (user) {
        if (bcrypt.compareSync(req.body.password, user.password)) {
          //Pasword match
          const payload = {
            id: user._id,
            name: user.name,
            email: user.email,
            password: user.password,
            role: user.role,
            wallet: user.wallet
          };
          let token = jwt.sign(payload, process.env.SECRET_KEY, {
            expiresIn: 1440
          });
          res.send({ token: token });
          next();
        } else {
          //pass do not match
          res.status(403).json({ error: 'Wrong password.' });
        }
      } else {
        res.status(400).json({ error: 'User does not exist.' });
      }
    })
    .catch(err => {
      res.send('error' + err);
    });
};
