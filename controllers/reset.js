const crypto = require('crypto');
const flash = require('flash');
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
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect('/');
    }

    const token = buffer.toString('hex');
    User.findOne({ email: req.body.email })
      .then(user => {
        if (!user) {
          console.log('BAD USER');
          req.flash('error', 'No account associated the email');
          return res.redirect('/');
        } else {
          user.resetToken = token;
          user.resetTokenExpiration = Date.now() + 3600000;
          user.save();
        }
      })
      .then(result => {
        let mailOptions = {
          from: '"Teodor 👻" <giveawin@gmail.com>', // sender address
          to: req.body.email, // list of receivers
          subject: 'Password Reset ✔', // Subject line
          text: 'Hello, ', // plain text body
          html: `
                  <p>You requested a password reset</p>
                  <p>Click this <a href = "http://localhost:3000/reset/password/${token}">link</a> to set a new password..... http://localhost:3000/reset/password/${token}</p>
                  ` // html body
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
      //   let message = req.flash('error');

      //   if (message.length > 0) {
      //     message = message[0];
      //   } else {
      //     message = null;
      //   }
      //user.password = req.body.password;
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
