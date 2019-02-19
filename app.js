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

// CORS HANDLING
// Send headers from SERVER to CLIENT to let client know it can access my resources

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE');
    return res.status(200).json({});
  }
  next();
});

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

// Connect to database
mongoose
  .connect(
    'mongodb+srv://apetrisor:Zaq123ap%21@cluster0-c1rs5.mongodb.net/Donate2Win?retryWrites=true',
    { useNewUrlParser: true }
  )
  .then()
  .catch(err => {
    console.log(err);
  });

// ADD A FLAG ON PRODUCT TO MARK IT AS OPEN, CLOSED
// Cron job
// This will be used for running the contest
// Every hour this script will run and look at the end dates for all products
// If an end date has passed, that means the contest has completed for that product
// At that point, we select a winner from all the OPEN bids submitted on that product
// In a separate collection, we save an object of shape:
// {
//      winner: user object
//      product: product won
// }
// -> flag the product as CLOSED to stop the contest starting again for the same product
// -> flag all bids on that product as CLOSED
// This collection is called regularly by the Front-end
// If they find their user in the winner's collection, they will pop-up a message: 'Congratz you won'

let cron = require('node-cron');

cron.schedule('* * * * *', () => {
  console.log('running a task every minute');
});

module.exports = app;
