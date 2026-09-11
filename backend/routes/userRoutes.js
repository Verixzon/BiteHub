const express = require('express')
const router = express.Router()

const {
  getAllUsers,
    adminDeleteUser,
  adminUpdateUserRole,
} = require('../controllers/userController')

const authMiddleware = require('../middleware/authMiddleware')
const adminMiddleware = require('../middleware/adminMiddleware')

// Get all users for admin
router.get(
  '/admin/all',
  authMiddleware,
  adminMiddleware,
  getAllUsers
)

// Admin delete user
router.delete(
  '/admin/:userId',
  authMiddleware,
  adminMiddleware,
  adminDeleteUser
)

// Admin update user role
router.patch(
  '/admin/:userId/role',
  authMiddleware,
  adminMiddleware,
  adminUpdateUserRole
)

module.exports = router