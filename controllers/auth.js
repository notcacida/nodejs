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
          res.json({ error: 'User already exists' });
        }
      })
      .catch(err => {
        res.send('error' + err);
      });
  } else {
    res.json({ error: 'Email no good' });
  }

  //   req.checkBody('name', 'Name is required').notEmpty();
  //   req.check('email', 'Email is required.').notEmpty();
  //   req.check('email', 'Email is not valid').isEmail();
  //   req.check('password', 'Password is required').notEmpty();
  //   req.check('password2', 'Passwords do not match').equals(req.body.password);

  //   let errors = req.validationErrors();
};

exports.Login = (req, res) => {
  User.findOne({
    email: req.body.email
  })
    .then(user => {
      if (user) {
        if (bcrypt.compareSync(req.body.password, user.password)) {
          //Pasword match
          const payload = {
            name: user.name,
            email: user.email,
            password: user.password
          };
          let token = jwt.sign(payload, process.env.SECRET_KEY, {
            expiresIn: 1440
          });
          res.send(token);
        } else {
          //pass do not match
          res.json({ error: 'Wrong password' });
        }
      } else {
        res.json({ error: 'User does not exists' });
      }
    })
    .catch(err => {
      res.send('error' + err);
    });
};
