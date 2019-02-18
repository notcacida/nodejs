const express = require('express');
const router = express.Router();

const { validateBody, schemas } = require('../util/helpers');
const authController = require('../controllers/auth');
let verifyToken = require('../util/verifyToken');

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

module.exports = router;
