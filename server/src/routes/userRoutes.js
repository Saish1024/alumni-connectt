const express = require('express');
const {
    getUsers,
    getUserById,
    updateProfile,
    approveUser,
    deleteUser,
    getPendingUsers,
    adminUpdateUser,
    getStudentStats,
    getLeaderboard
} = require('../controllers/userController');
const { auth, checkRole } = require('../middleware/auth');

const router = express.Router();

// Public
router.get('/', getUsers); // Alumni directory - list all approved users

// Protected
router.get('/pending', auth, checkRole(['admin']), getPendingUsers);
router.get('/stats', auth, getStudentStats);
router.get('/:id', auth, getUserById);
router.put('/profile', auth, updateProfile);
router.put('/:id', auth, checkRole(['admin']), adminUpdateUser);
router.put('/:id/approve', auth, checkRole(['admin']), approveUser);
router.delete('/:id', auth, checkRole(['admin']), deleteUser);

module.exports = router;
