const FacebookTokenStrategy = require('passport-facebook-token');
const GooglePlusTokenStrategy = require('passport-google-plus-token');
const passport = require('passport');
const User = require('../nodejs/models/User');

passport.use(
  'facebookToken',
  new FacebookTokenStrategy(
    {
      clientID: '2221710554824226',
      clientSecret: 'b533b14fe6e778e361b70c7c1a6bf761'
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const existinguser = await User.findOne({ 'facebook.id': profile.id });

        if (existinguser) {
          console.log('User allready exists in DB');
          return done(null, existinguser);
        }

        const newUser = new User({
          method: 'facebook',
          facebook: {
            id: profile.id,
            email: profile.emails[0].value
          }
        });
        console.log('Creating a new user');
        await newUser.save();
        done(null, newUser);
      } catch (error) {
        done(error, false, error.message);
      }
    }
  )
);

// GOOGLE OAUTH STRATEGY
passport.use(
  'googleToken',
  new GooglePlusTokenStrategy(
    {
      clientID:
        ' 515156778481-q732tc9bunsklslpm17sv5590qs8iv95.apps.googleusercontent.com ',
      clientSecret: ' viaK-PizV2ccIH6Qw9NjRhVA '
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log('profile', profile);
        //console.log('Sfarsit profil');

        //Check whether this current user exists in db
        const existinguser = await User.findOne({ 'google.id': profile.id });
        if (existinguser) {
          console.log('User allready exists in DB');
          return done(null, existinguser);
        }
        //console.log('a trecut de salvare');
        //If new account
        const newUser = new User({
          method: 'google',
          google: {
            id: profile.id,
            email: profile.emails[0].value
          }
        });
        console.log('Creating a new user');
        await newUser.save();
        done(null, newUser);
      } catch (error) {
        done(error, false, error.message);
      }
    }
  )
);
