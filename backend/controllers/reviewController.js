const Review = require('../models/Review')
const Order = require('../models/Order')


// Create a review
const createReview = async (req, res) => {
  try {
    const { food, rating, comment } = req.body

    const user = req.user.id

    if (!food || !rating || !comment) {
      return res.status(400).json({
        message: 'Food, rating and comment are required',
      })
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        message: 'Rating must be between 1 and 5',
      })
    }

    const order = await Order.findOne({
      user,
      status: 'delivered',
      'items.food': food,
    })

    if (!order) {
      return res.status(403).json({
        message: 'You can only review food you have purchased and received',
      })
    }

    const existingReview = await Review.findOne({
      user,
      food,
    })

    if (existingReview) {
      return res.status(400).json({
        message: 'You have already reviewed this food',
      })
    }

    const review = await Review.create({
      user,
      food,
      rating,
      comment,
    })

    res.status(201).json({
      message: 'Review created successfully',
      review,
    })
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message,
    })
  }
}


// Get reviews for a food
const getFoodReviews = async (req, res) => {
  try {
    const { foodId } = req.params

    const reviews = await Review.find({ food: foodId })
      .populate('user', 'name')
      .sort({ createdAt: -1 })

    const reviewCount = reviews.length

    const averageRating =
      reviewCount > 0
        ? reviews.reduce(
            (sum, review) => sum + review.rating,
            0
          ) / reviewCount
        : 0

    res.json({
      reviews,
      reviewCount,
      averageRating: Number(averageRating.toFixed(1)),
    })
  } catch (error) {
    res.status(500).json({
      message: 'Failed to get reviews',
      error: error.message,
    })
  }
}

// Update a review
const updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params
    const { rating, comment } = req.body

    const user = req.user.id

    if (!rating || !comment) {
      return res.status(400).json({
        message: 'Rating and comment are required',
      })
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        message: 'Rating must be between 1 and 5',
      })
    }

    const review = await Review.findOne({
      _id: reviewId,
      user,
    })

    if (!review) {
      return res.status(404).json({
        message: 'Review not found or you are not allowed to edit it',
      })
    }

    review.rating = rating
    review.comment = comment.trim()

    await review.save()

    res.json({
      message: 'Review updated successfully',
      review,
    })
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message,
    })
  }
}


// Delete a review
const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params

    const user = req.user.id

    const review = await Review.findOne({
      _id: reviewId,
      user,
    })

    if (!review) {
      return res.status(404).json({
        message: 'Review not found or you are not allowed to delete it',
      })
    }

    await Review.findByIdAndDelete(reviewId)

    res.json({
      message: 'Review deleted successfully',
    })
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message,
    })
    }

}


// Get all reviews for admin
const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate('user', 'name email')
      .populate('food', 'name')
      .sort({ createdAt: -1 })

    res.json(reviews)
  } catch (error) {
    res.status(500).json({
      message: 'Failed to get reviews',
      error: error.message,
    })
  }
}

// Admin delete a review
const adminDeleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params

    const review = await Review.findById(reviewId)

    if (!review) {
      return res.status(404).json({
        message: 'Review not found',
      })
    }

    await Review.findByIdAndDelete(reviewId)

    res.json({
      message: 'Review deleted successfully',
    })
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message,
    })
  }
}

module.exports = {
  createReview,
  getFoodReviews,
  updateReview,
    deleteReview,
    getAllReviews,
    adminDeleteReview,
    
}