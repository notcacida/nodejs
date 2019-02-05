const express = require('express');
const router = express.Router();

const userController = require('../controllers/user');

// Add a user
router.post('/', userController.addUser);
// Get all users
router.get('/', userController.getAllUsers);
// Get one user
router.get('/:userId', userController.getUser);
// Update user
router.put('/:userId', userController.editUser);
// Delete user
router.delete('/:userId', userController.deleteUser);

module.exports = router;
