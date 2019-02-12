const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

let User = require('../models/User');
const authControler = require('../controllers/forgot');

router.post('/password', authControler.Password);
router.post('/reset/:token', authControler.Reset);

module.exports = router;
