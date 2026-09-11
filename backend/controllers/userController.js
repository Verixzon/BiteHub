const User = require('../models/User')

// Get all users for admin
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })

    res.json(users)
  } catch (error) {
    res.status(500).json({
      message: 'Failed to get users',
      error: error.message,
    })
  }
}

// Admin delete user
const adminDeleteUser = async (req, res) => {
  try {
    const { userId } = req.params

    // Prevent admin from deleting their own account
    if (userId === req.user.id) {
      return res.status(400).json({
        message: 'You cannot delete your own admin account',
      })
    }

    const user = await User.findById(userId)

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      })
    }

    await User.findByIdAndDelete(userId)

    res.json({
      message: 'User deleted successfully',
    })
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message,
    })
  }
}

// Admin update user role
const adminUpdateUserRole = async (req, res) => {
  try {
    const { userId } = req.params
    const { role } = req.body

    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({
        message: 'Invalid role',
      })
    }

    // Prevent admin from changing their own role
    if (userId === req.user.id) {
      return res.status(400).json({
        message: 'You cannot change your own admin role',
      })
    }

    const user = await User.findById(userId)

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      })
    }

    user.role = role

    await user.save()

    res.json({
      message: 'User role updated successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    })
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message,
    })
  }
}

module.exports = {
  getAllUsers,
  adminDeleteUser,
  adminUpdateUserRole,
}