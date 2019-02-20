const express = require('express');
const router = express.Router();

const passport = require('passport');
const passportConfig = require('../passport');
const { validateBody, schemas } = require('../util/helpers');
const authController = require('../controllers/auth');
let verifyToken = require('../util/verifyToken');
const passportFacebook = passport.authenticate('facebookToken', {
  session: false
});
const passportGoogle = passport.authenticate('googleToken', { session: false });
//Register process
router.post(
  '/register',
  validateBody(schemas.authSchema),
  authController.Register
);
// Login
router.post('/login', validateBody(schemas.loginSchema), authController.Login);
// Logout
router.post('/logout', verifyToken, authController.Logout);
//login with google
router.post('/oauth/google', passportGoogle, authController.googleOAuth);
//Login with fb
router.post('/oauth/facebook', passportFacebook, authController.facebookOAuth);

module.exports = router;
