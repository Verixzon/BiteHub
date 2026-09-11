const express = require('express')
const Food = require('../models/Food')
const protect = require('../middleware/authMiddleware')
const adminOnly = require('../middleware/adminMiddleware')

const router = express.Router()

// Get all foods
router.get('/', async (req, res) => {
  try {
    const foods = await Food.find().sort({ createdAt: -1 })

    res.json(foods)
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Failed to fetch foods',
    })
  }
})

// Get one food
router.get('/:id', async (req, res) => {
  try {
    const food = await Food.findById(req.params.id)

    if (!food) {
      return res.status(404).json({
        message: 'Food not found',
      })
    }

    res.json(food)
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Failed to fetch food',
    })
  }
})

// Add food - Admin only
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { name, category, price, image } = req.body

    const food = await Food.create({
      name,
      category,
      price,
      image,
    })

    res.status(201).json({
      message: 'Food added successfully.',
      food,
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Failed to add food.',
    })
  }
})

// Update food - Admin only
router.patch('/:id', protect, adminOnly, async (req, res) => {
  try {
    const { name, category, price, image } = req.body

    const food = await Food.findByIdAndUpdate(
      req.params.id,
      {
        name,
        category,
        price,
        image,
      },
      {
        new: true,
        runValidators: true,
      }
    )

    if (!food) {
      return res.status(404).json({
        message: 'Food not found.',
      })
    }

    res.json({
      message: 'Food updated successfully.',
      food,
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Failed to update food.',
    })
  }
})

// Delete food - Admin only
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const food = await Food.findByIdAndDelete(req.params.id)

    if (!food) {
      return res.status(404).json({
        message: 'Food not found.',
      })
    }

    res.json({
      message: 'Food deleted successfully.',
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Failed to delete food.',
    })
  }
})

module.exports = router