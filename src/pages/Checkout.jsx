import { useState } from 'react'
import { useCart } from '../services/CartContext.jsx'

function Checkout() {
  const { cartItems } = useCart()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  )

  const deliveryFee = cartItems.length > 0 ? 1000 : 0
  const total = subtotal + deliveryFee

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) {
      setError('Your cart is empty.')
      return
    }

    try {
      setLoading(true)
      setError('')

      const token = localStorage.getItem('bitehub-token')

      const orderResponse = await fetch(
        'https://bitehub-emzx.onrender.com/api/orders',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            items: cartItems.map((item) => ({
              food: item._id,
              name: item.name,
              price: item.price,
              quantity: item.quantity,
            })),
            totalAmount: total,
          }),
        }
      )

      const orderData = await orderResponse.json()

      if (!orderResponse.ok) {
        setError(
          orderData.message || 'Failed to create order.'
        )
        return
      }

      const paymentResponse = await fetch(
        'https://bitehub-emzx.onrender.com/api/payments/initialize',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            orderId: orderData.order._id,
          }),
        }
      )

      const paymentData = await paymentResponse.json()

      if (!paymentResponse.ok) {
        setError(
          paymentData.message ||
            'Failed to initialize payment.'
        )
        return
      }

      localStorage.setItem(
        'bitehub-pending-order',
        JSON.stringify({
          orderId: orderData.order._id,
          cartItems,
        })
      )

      window.location.href = paymentData.authorization_url
    } catch (error) {
      console.error(error)
      setError('Unable to connect to the server.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="checkout-page">
      <section className="checkout-header">
        <p>CHECKOUT</p>

        <h1>Complete Your Order</h1>

        <span>
          Review your order and proceed to secure payment.
        </span>
      </section>

      {error && (
        <p className="checkout-error">
          {error}
        </p>
      )}

      <section className="checkout-content">
        <div className="checkout-items">
          <h2>Your Order</h2>

          {cartItems.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            cartItems.map((item) => (
              <div
                className="checkout-item"
                key={item._id}
              >
                <div className="checkout-item-image">
                  <img
                    src={item.image}
                    alt={item.name}
                  />
                </div>

                <div className="checkout-item-info">
                  <h3>{item.name}</h3>

                  <p>
                    ₦{item.price.toLocaleString()} ×{' '}
                    {item.quantity}
                  </p>
                </div>

                <strong>
                  ₦{(
                    item.price * item.quantity
                  ).toLocaleString()}
                </strong>
              </div>
            ))
          )}
        </div>

        <div className="checkout-summary">
          <h2>Order Summary</h2>

          <div className="summary-row">
            <span>Subtotal</span>

            <span>
              ₦{subtotal.toLocaleString()}
            </span>
          </div>

          <div className="summary-row">
            <span>Delivery Fee</span>

            <span>
              ₦{deliveryFee.toLocaleString()}
            </span>
          </div>

          <div className="summary-total">
            <span>Total</span>

            <strong>
              ₦{total.toLocaleString()}
            </strong>
          </div>

          <button
            type="button"
            onClick={handlePlaceOrder}
            disabled={
              loading || cartItems.length === 0
            }
          >
            {loading
              ? 'Processing payment...'
              : 'Proceed to Payment'}
          </button>
        </div>
      </section>
    </main>
  )
}

export default Checkout