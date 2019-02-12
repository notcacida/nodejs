const express = require('express');
const router = express.Router();

const userController = require('../controllers/user');
const verifyToken = require('../util/verifyToken');

// Add a user
// Verify token will only let user continue if an Authorization header is sent with request
// Otherwise, get a 403
// This token is checked further in the controller

router.post('/', verifyToken, userController.addUser);
// Get all users
router.get('/', userController.getAllUsers);
// Get one user
router.get('/:userId', userController.getUser);
// Update user
router.put('/:userId', userController.editUser);
// Delete user
router.delete('/:userId', userController.deleteUser);

// Add money to wallet
router.post('/wallet/:userId', userController.addMoney);

module.exports = router;
