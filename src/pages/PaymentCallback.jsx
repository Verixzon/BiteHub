import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useCart } from '../services/CartContext.jsx'

function PaymentCallback() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { clearCart } = useCart()

  const [message, setMessage] = useState(
    'Verifying your payment...'
  )
  const [error, setError] = useState(false)

  useEffect(() => {
    async function verifyPayment() {
      try {
        const reference = searchParams.get('reference')

        if (!reference) {
          setError(true)
          setMessage('Payment reference was not found.')
          return
        }

        const token = localStorage.getItem('bitehub-token')

        const response = await fetch(
          `http://localhost:5000/api/payments/verify/${reference}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        const data = await response.json()

        if (!response.ok) {
          setError(true)
          setMessage(
            data.message || 'Payment verification failed.'
          )
          return
        }

        clearCart()

        localStorage.removeItem('bitehub-pending-order')

        setMessage(
          'Payment successful! Redirecting to your orders...'
        )

        setTimeout(() => {
          navigate('/orders')
        }, 1500)
      } catch (error) {
        console.error(error)

        setError(true)
        setMessage(
          'Unable to verify your payment. Please try again.'
        )
      }
    }

    verifyPayment()
  }, [searchParams, navigate, clearCart])

  return (
    <main
      className={`payment-callback-page ${
        error ? 'payment-failed' : 'payment-success'
      }`}
    >
      <section className="payment-callback-card">
        <div className="payment-callback-icon">
          {error ? '✕' : '✓'}
        </div>

        <p className="payment-callback-label">
          {error ? 'PAYMENT STATUS' : 'PAYMENT CONFIRMED'}
        </p>

        <h1>
          {error
            ? 'Payment Verification Failed'
            : 'Payment Successful'}
        </h1>

        <p className="payment-callback-message">
          {message}
        </p>

        {!error && (
          <div className="payment-callback-loader">
            <span></span>
            <span></span>
            <span></span>
          </div>
        )}

        {error && (
          <button
            type="button"
            onClick={() => navigate('/checkout')}
          >
            Return to Checkout
          </button>
        )}
      </section>
    </main>
  )
}

export default PaymentCallback