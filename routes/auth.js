const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

let User = require('../models/User');
const authControler = require('../controllers/auth');

//register form
// router.get('/register', (req, res) => {

//     //asta va trebui sa mi afiseze din veiw, dar nu l avem noi pe back
//     //il luam din partea de front
//     res.render('register');

// });

//register process

router.post('/register', authControler.Register);

module.exports = router;
