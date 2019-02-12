const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

let User = require('../models/User');
const authControler = require('../controllers/auth');

//Register process

router.post('/register', authControler.Register);
router.post('/login', authControler.Login);

module.exports = router;
