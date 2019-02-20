const express = require('express');
const router = express.Router();
const multer = require('multer');

// Where to store pictures received,
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    // 1MB limit on uploaded pictures
    fileSize: 1024 * 1024
  }
});

const verifyToken = require('../util/verifyToken');
const verifyLoggedIn = require('../util/verifyLoggedIn');

const userController = require('../controllers/user');

// Add a user
// Verify token will only let user continue if an Authorization header is sent with request
// Otherwise, get a 403
// Type of user making request is further checked in controller

router.post(
  '/',
  verifyToken,
  verifyLoggedIn,
  upload.single('userImage'),
  userController.addUser
);
// Get all users
router.get('/', verifyLoggedIn, userController.getAllUsers);
// Get one user
router.get('/:userId', verifyLoggedIn, userController.getUser);
// Update user
router.put('/:userId', verifyToken, verifyLoggedIn, userController.editUser);
// Delete user
router.delete(
  '/:userId',
  verifyToken,
  verifyLoggedIn,
  userController.deleteUser
);

// Add money to wallet
router.post('/wallet/:userId', verifyLoggedIn, userController.addMoney);

module.exports = router;
