const bcrypt = require('bcryptjs');

let User = require('../models/User');

exports.Register = (req, res) => {
  const name = req.body.name;
  //console.log(name);
  const email = req.body.email;
  const password = req.body.password;
  const password2 = req.body.password2;

  //   req.checkBody('name', 'Name is required').notEmpty();
  //   req.checkBody('email', 'Email is required').notEmpty();
  //   req.checkBody('email', 'Email must be vaild').isEmail();
  //   req.checkBody('password', 'Password is required').notEmpty();
  //   req.checkBody('password', 'Password do not match').equals(req.body.password);

  //   let errors = req.validationError();

  let newUser = new User({
    name: name,
    email: email,
    password: password
  });
  //console.log(newUser);

  bcrypt.getSalt(10, (err, salt) => {
    bcrypt.hash(newUser.password, salt, (err, hash) => {
      //console.log(newUser.password);
      if (err) {
        res.json(err);
      }
      newUser.password = hash;
      //console.log(newUser.password);
      newUser.save(err => {
        if (err) {
          res.json(err);
          return;
        } else {
          req.flash('success', 'You are now registered and can log in !');
          res.redirect('/auth/login');
        }
      });
    });
  });
};
