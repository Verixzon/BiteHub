const express = require('express')
const router = express.Router()

const {
  createReview,
  getFoodReviews,
  updateReview,
  deleteReview,
  getAllReviews,
  adminDeleteReview,
} = require('../controllers/reviewController')

const authMiddleware = require('../middleware/authMiddleware')
const adminMiddleware = require('../middleware/adminMiddleware')

// Get reviews for a food
router.get('/food/:foodId', getFoodReviews)

// Create a review
router.post('/', authMiddleware, createReview)

// Update a review
router.patch('/:reviewId', authMiddleware, updateReview)

// Delete a review
router.delete('/:reviewId', authMiddleware, deleteReview)

// Get all reviews for admin
router.get(
  '/admin/all',
  authMiddleware,
  adminMiddleware,
  getAllReviews
)

// Admin delete review
router.delete(
  '/admin/:reviewId',
  authMiddleware,
  adminMiddleware,
  adminDeleteReview
)

module.exports = router