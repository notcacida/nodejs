const express = require('express');
const mongoose = require('mongoose');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const createError = require('http-errors');

// Routes
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/user');
const bidsRouter = require('./routes/bid');
const productRouter = require('./routes/product');
const charityRouter = require('./routes/charity');
// Models
const User = require('./models/User');
// App setup
const app = express();
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Login fake user before using app
// append user object to request
app.use((req, res, next) => {
  User.findById('5c58921ada83e80b10dc7ac7')
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

// Routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/bids', bidsRouter);
app.use('/products', productRouter);
app.use('/charities', charityRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
});

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
