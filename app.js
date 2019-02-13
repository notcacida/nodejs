const express = require('express');
const mongoose = require('mongoose');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const expressValidator = require('express-validator');
const jwt = require('jsonwebtoken');

// Routes
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/user');
const bidsRouter = require('./routes/bid');
const productRouter = require('./routes/product');
const charityRouter = require('./routes/charity');
const authRouter = require('./routes/auth');
const resetRouter = require('./routes/reset');

const verifyUser = require('./util/verifyUser');

// Models
const User = require('./models/User');

// App setup
const app = express();
app.use(expressValidator());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
mongoose.set('useFindAndModify', false);

// Login actual user before using app
// We look at token and login THAT user, belonging to the token
// We append this user object to every subsequent request made by our app.
app.use(verifyUser, (req, res, next) => {
  jwt.verify(req.token, 'secret', (err, authData) => {
    if (err) {
      // Action done as guest
      console.log('Action is done as guest');
      next();
    } else {
      // Actions done as logged in user
      User.findById(authData.id)
        .then(user => {
          req.user = user;
          console.log('Action is done by user: ', req.user);
          next();
        })
        .catch(err => console.log(err));
    }
  });
});

// Routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/bids', bidsRouter);
app.use('/products', productRouter);
app.use('/charities', charityRouter);
app.use('/auth', authRouter);
app.use('/reset', resetRouter);
// Routes are protected in respective controller files

// 404 page
app.use('*', function(req, res, next) {
  res.status(404);
  next();
});
// 404 responses for composite routes are handled in each route's respective controller

// // Look at this later
// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   const err = createError(404);
//   next(err);
// });

// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};
//   res.status(err.status || 500);
// });

// Connect to database
mongoose
  .connect(
    'mongodb+srv://apetrisor:Zaq123ap%21@cluster0-c1rs5.mongodb.net/Donate2Win?retryWrites=true',
    { useNewUrlParser: true }
  )
  .then(result => {
    User.findOne().then(user => {
      if (!user) {
        const user = new User({
          name: 'adi',
          email: 'user@user.net',
          password: '123456',
          cart: {
            items: []
          }
        });
        user.save();
      }
    });
  })
  .catch(err => {
    console.log(err);
  });

module.exports = app;
