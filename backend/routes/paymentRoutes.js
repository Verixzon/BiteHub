const express = require('express')
const axios = require('axios')
const Order = require('../models/Order')
const User = require('../models/User')
const protect = require('../middleware/authMiddleware')

const router = express.Router()

// Initialize Paystack payment
router.post('/initialize', protect, async (req, res) => {
  try {
    const { orderId } = req.body

    const order = await Order.findOne({
      _id: orderId,
      user: req.user.id,
    })

    if (!order) {
      return res.status(404).json({
        message: 'Order not found.',
      })
    }

    if (order.paymentStatus === 'paid') {
      return res.status(400).json({
        message: 'This order has already been paid for.',
      })
    }

    const user = await User.findById(req.user.id)

    if (!user) {
      return res.status(404).json({
        message: 'User not found.',
      })
    }

    const response = await axios.post(
      'https://api.paystack.co/transaction/initialize',
      {
        email: user.email,
        amount: Math.round(order.totalAmount * 100),
        callback_url: 'http://localhost:5173/payment/callback',
        metadata: {
          orderId: order._id.toString(),
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    )

    const paymentData = response.data.data

    order.paymentReference = paymentData.reference

    await order.save()

    res.json({
      message: 'Payment initialized successfully.',
      authorization_url: paymentData.authorization_url,
      reference: paymentData.reference,
    })
  } catch (error) {
    console.error(
      'Paystack initialization error:',
      error.response?.data || error.message
    )

    res.status(500).json({
      message: 'Failed to initialize payment.',
    })
  }
})

// Verify Paystack payment
router.get('/verify/:reference', protect, async (req, res) => {
  try {
    const { reference } = req.params

    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    )

    const paymentData = response.data.data

    if (paymentData.status !== 'success') {
      return res.status(400).json({
        message: 'Payment was not successful.',
        status: paymentData.status,
      })
    }

    const order = await Order.findOne({
      paymentReference: reference,
      user: req.user.id,
    })

    if (!order) {
      return res.status(404).json({
        message: 'Order associated with this payment was not found.',
      })
    }

    order.paymentStatus = 'paid'

    await order.save()

    res.json({
      message: 'Payment verified successfully.',
      order,
    })
  } catch (error) {
    console.error(
      'Paystack verification error:',
      error.response?.data || error.message
    )

    res.status(500).json({
      message: 'Failed to verify payment.',
    })
  }
})

module.exports = router