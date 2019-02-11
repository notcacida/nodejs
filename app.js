const express = require('express');
const mongoose = require('mongoose');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const createError = require('http-errors');
const expressValidator = require('express-validator');

// Routes
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/user');
const bidsRouter = require('./routes/bid');
const productRouter = require('./routes/product');
const charityRouter = require('./routes/charity');
const authRouter = require('./routes/auth');
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

// Login fake user before using app
// append user object to request
app.use((req, res, next) => {
  User.findById('5c5994b1aee5312b881690f5')
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
app.use('/auth', authRouter);

// 404 page
app.use('*', function(req, res) {
  res.status(404).send('404 Not found');
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
