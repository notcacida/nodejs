const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth');
let verifyToken = require('../util/verifyToken');

//Register process
router.post('/register', authController.Register);
// Login
router.post('/login', authController.Login);
// Logout
router.post('/logout', verifyToken, authController.Logout);

module.exports = router;
