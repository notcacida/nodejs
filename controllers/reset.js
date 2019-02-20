const crypto = require('crypto');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');

//Models
const User = require('../models/User');

// ACTIONS

let config = {
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // use SSL
  auth: {
    user: 'giveawin@gmail.com',
    pass: 'qwe3sx2gmail'
  }
};

let transporter = nodemailer.createTransport(config);

//Prepare Reset password
exports.resetPassword = (req, res, next) => {
  // Use this to send the corect link over email, regardless of where the app is hosted
  let rootUrl = req.protocol + '://' + req.get('host');

  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect('/');
    }

    const token = buffer.toString('hex');
    User.findOne({ 'local.email': req.body.email })
      .then(user => {
        if (!user) {
          console.log('BAD USER');
          return res.redirect('/');
        } else {
          user.resetToken = token;
          user.resetTokenExpiration = Date.now() + 3600000;
          user.save();
        }
      })
      .then(result => {
        let mailOptions = {
          from: '"Teodor 👻" <giveawin@gmail.com>',
          to: req.body.email,
          subject: 'Password Reset ✔',
          text: 'Hello, ',
          html: `
                  <p>You requested a password reset</p>
                  <p>Click this <a href = "${rootUrl}/reset/password/${token}">link</a> to set a new password.....
                  ${rootUrl}/reset/password/${token}</p>
                `
        };
        res.redirect('/');
        transporter.sendMail(mailOptions);
      })
      .catch(err => {
        console.log(err);
      });
  });
};

exports.afterResetPassword = (req, res, next) => {
  console.log('abc');
  const token = req.params.token;
  console.log(token);
  User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
    .then(user => {
      bcrypt.hash(req.body.password, 10, (err, hash) => {
        user.password = hash;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        user.save();
        res.redirect('/');
      });
    })
    .catch(err => {
      console.log(err);
    });
};
