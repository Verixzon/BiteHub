const express = require('express')
const Order = require('../models/Order')
const Food = require('../models/Food')
const protect = require('../middleware/authMiddleware')
const adminOnly = require('../middleware/adminMiddleware')

const router = express.Router()

// Create a pending order
router.post('/', protect, async (req, res) => {
  try {
    const { items } = req.body

    if (!items || items.length === 0) {
      return res.status(400).json({
        message: 'Order must contain at least one item.',
      })
    }

    // Get the actual foods and prices from the database
    const foodIds = items.map((item) => item.food)

    const foods = await Food.find({
      _id: { $in: foodIds },
    })

    if (foods.length !== items.length) {
      return res.status(400).json({
        message: 'One or more foods could not be found.',
      })
    }

    const orderItems = items.map((item) => {
      const food = foods.find(
        (food) => food._id.toString() === item.food
      )

      if (!food) {
        throw new Error('Food not found.')
      }

      const quantity = Number(item.quantity)

      if (!Number.isInteger(quantity) || quantity < 1) {
        throw new Error('Invalid item quantity.')
      }

      return {
        food: food._id,
        name: food.name,
        price: food.price,
        quantity,
      }
    })

    // Calculate subtotal using database prices
    const subtotal = orderItems.reduce(
      (total, item) => {
        return total + item.price * item.quantity
      },
      0
    )

    // Keep the current BiteHub delivery fee
    const deliveryFee = orderItems.length > 0 ? 1000 : 0

    const totalAmount = subtotal + deliveryFee

    const order = await Order.create({
      user: req.user.id,
      items: orderItems,
      totalAmount,
      paymentStatus: 'pending',
      status: 'pending',
    })

    res.status(201).json({
      message: 'Order created successfully.',
      order,
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Failed to create order.',
    })
  }
})

// Get logged-in user's orders
router.get('/my-orders', protect, async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user.id,
    })
      .populate('items.food')
      .sort({ createdAt: -1 })

    res.json(orders)
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Failed to fetch orders.',
    })
  }
})

// Get all orders - Admin only
router.get('/admin/all', protect, adminOnly, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email phone')
      .populate('items.food')
      .sort({ createdAt: -1 })

    res.json(orders)
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Failed to fetch all orders.',
    })
  }
})

// Update order status - Admin only
router.patch(
  '/admin/:id/status',
  protect,
  adminOnly,
  async (req, res) => {
    try {
      const { status } = req.body

      const allowedStatuses = [
        'pending',
        'confirmed',
        'preparing',
        'out-for-delivery',
        'delivered',
        'cancelled',
      ]

      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          message: 'Invalid order status.',
        })
      }

      const order = await Order.findByIdAndUpdate(
        req.params.id,
        { status },
        {
          new: true,
          runValidators: true,
        }
      )

      if (!order) {
        return res.status(404).json({
          message: 'Order not found.',
        })
      }

      res.json({
        message: 'Order status updated successfully.',
        order,
      })
    } catch (error) {
      console.error(error)

      res.status(500).json({
        message: 'Failed to update order status.',
      })
    }
  }
)

module.exports = router