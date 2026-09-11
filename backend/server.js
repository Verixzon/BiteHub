const dns = require('dns')

dns.setServers(['8.8.8.8', '8.8.4.4'])

const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const mongoose = require('mongoose')

dotenv.config()

const foodRoutes = require('./routes/foodRoutes')
const authRoutes = require('./routes/authRoutes')
const orderRoutes = require('./routes/orderRoutes')
const paymentRoutes = require('./routes/paymentRoutes')
const reviewRoutes = require('./routes/reviewRoutes')
const userRoutes = require('./routes/userRoutes')

const app = express()

app.use(cors())
app.use(express.json())

console.log('MONGODB_URI exists:', !!process.env.MONGODB_URI)
console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET)

console.log(
  'PAYSTACK_SECRET_KEY exists:',
  !!process.env.PAYSTACK_SECRET_KEY
)

const PORT = process.env.PORT || 5000

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected successfully!')

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  })
  .catch((error) => {
    console.error('MongoDB connection failed:', error.message)
  })

app.get('/', (req, res) => {
  res.json({
    message: 'BiteHub API is running',
  })
})

app.use('/api/foods', foodRoutes)

app.use('/api/auth', authRoutes)

app.use('/api/orders', orderRoutes)

app.use('/api/payments', paymentRoutes)

app.use('/api/reviews', reviewRoutes)

app.use('/api/users', userRoutes)