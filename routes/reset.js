var express = require('express');
var router = express.Router();

var resetController = require('../controllers/reset');

// Reset Password
router.post('/password', resetController.resetPassword);
router.get('/password/:token', resetController.afterResetPassword);
module.exports = router;
