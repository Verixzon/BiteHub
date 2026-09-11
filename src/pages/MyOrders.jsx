import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function MyOrders() {
  const navigate = useNavigate()

  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [reviewData, setReviewData] = useState({})
  const [reviewMessage, setReviewMessage] = useState({})
  const [submittingReview, setSubmittingReview] = useState({})

  const statuses = [
    'pending',
    'confirmed',
    'preparing',
    'out-for-delivery',
    'delivered',
  ]

  useEffect(() => {
    async function loadOrders() {
      try {
        const token = localStorage.getItem('bitehub-token')

        const response = await fetch(
          'http://localhost:5000/api/orders/my-orders',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        const data = await response.json()

        if (!response.ok) {
          setError(data.message || 'Failed to load orders.')
          return
        }

        setOrders(data)
      } catch (error) {
        setError('Unable to connect to the server.')
      } finally {
        setLoading(false)
      }
    }

    loadOrders()
  }, [])

  const getStatusClass = (status) => {
    return `order-status status-${status}`
  }

  const getStatusLabel = (status) => {
    return status
      .replaceAll('-', ' ')
      .replace(/\b\w/g, (letter) => letter.toUpperCase())
  }

  const getStatusIndex = (status) => {
    return statuses.indexOf(status)
  }

  const handleRatingChange = (foodId, rating) => {
    setReviewData((previous) => ({
      ...previous,
      [foodId]: {
        ...previous[foodId],
        rating,
      },
    }))
  }

  const handleCommentChange = (foodId, comment) => {
    setReviewData((previous) => ({
      ...previous,
      [foodId]: {
        ...previous[foodId],
        comment,
      },
    }))
  }

  const submitReview = async (foodId) => {
    const review = reviewData[foodId]

    if (!review?.rating || !review?.comment?.trim()) {
      setReviewMessage((previous) => ({
        ...previous,
        [foodId]: 'Please select a rating and write a review.',
      }))
      return
    }

    try {
      setSubmittingReview((previous) => ({
        ...previous,
        [foodId]: true,
      }))

      setReviewMessage((previous) => ({
        ...previous,
        [foodId]: '',
      }))

      const token = localStorage.getItem('bitehub-token')

      const response = await fetch(
        'http://localhost:5000/api/reviews',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            food: foodId,
            rating: review.rating,
            comment: review.comment.trim(),
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        setReviewMessage((previous) => ({
          ...previous,
          [foodId]: data.message || 'Failed to submit review.',
        }))
        return
      }

      setReviewMessage((previous) => ({
        ...previous,
        [foodId]: 'Review submitted successfully! ⭐',
      }))

      setReviewData((previous) => ({
        ...previous,
        [foodId]: {
          rating: '',
          comment: '',
        },
      }))
    } catch (error) {
      setReviewMessage((previous) => ({
        ...previous,
        [foodId]: 'Unable to connect to the server.',
      }))
    } finally {
      setSubmittingReview((previous) => ({
        ...previous,
        [foodId]: false,
      }))
    }
  }

  if (loading) {
    return (
      <main className="orders-page">
        <p className="orders-message">
          Loading your orders...
        </p>
      </main>
    )
  }

  if (error) {
    return (
      <main className="orders-page">
        <p className="orders-message orders-error">
          {error}
        </p>
      </main>
    )
  }

  return (
    <main className="orders-page">
      <section className="orders-header">
        <p>ORDER HISTORY</p>

        <h1>My Orders</h1>

        <span>
          Keep track of your BiteHub orders.
        </span>
      </section>

      {orders.length === 0 ? (
        <section className="no-orders">
          <div className="no-orders-icon">
            🍽️
          </div>

          <h2>No orders yet</h2>

          <p>
            You haven't placed any orders yet.
          </p>

          <button
            type="button"
            onClick={() => navigate('/menu')}
          >
            Browse Menu
          </button>
        </section>
      ) : (
        <section className="orders-list">
          {orders.map((order) => {
            const currentStatusIndex = getStatusIndex(
              order.status
            )

            return (
              <article
                className="order-card"
                key={order._id}
              >
                <div className="order-card-header">
                  <div>
                    <p>ORDER</p>

                    <h2>
                      #{order._id.slice(-6).toUpperCase()}
                    </h2>

                    <span>
                      {new Date(
                        order.createdAt
                      ).toLocaleDateString('en-NG', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </span>
                  </div>

                  <span
                    className={getStatusClass(order.status)}
                  >
                    {getStatusLabel(order.status)}
                  </span>
                </div>

                <div className="order-tracking">
                  <h3>Order Tracking</h3>

                  <div className="tracking-steps">
                    {statuses.map((status, index) => {
                      const completed =
                        index <= currentStatusIndex

                      return (
                        <div
                          className={`tracking-step ${
                            completed
                              ? 'tracking-completed'
                              : ''
                          }`}
                          key={status}
                        >
                          <div className="tracking-dot">
                            {completed ? '✓' : ''}
                          </div>

                          <span>
                            {getStatusLabel(status)}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="order-items">
                  {order.items.map((item, index) => {
                    const foodId =
                      typeof item.food === 'object'
                        ? item.food._id
                        : item.food

                    return (
                      <div
                        className="order-item"
                        key={`${order._id}-${index}`}
                      >
                        <div>
                          <h3>{item.name}</h3>

                          <p>
                            ₦{item.price.toLocaleString()} ×{' '}
                            {item.quantity}
                          </p>
                        </div>

                        <strong>
                          ₦
                          {(
                            item.price * item.quantity
                          ).toLocaleString()}
                        </strong>

                        {order.status === 'delivered' && (
                          <div className="review-section">
                            <h4>Rate this food</h4>

                            <div className="review-stars">
                              {[1, 2, 3, 4, 5].map(
                                (star) => (
                                  <button
                                    type="button"
                                    key={star}
                                    className={
                                      reviewData[foodId]
                                        ?.rating >= star
                                        ? 'star selected'
                                        : 'star'
                                    }
                                    onClick={() =>
                                      handleRatingChange(
                                        foodId,
                                        star
                                      )
                                    }
                                  >
                                    ★
                                  </button>
                                )
                              )}
                            </div>

                            <textarea
                              placeholder="Write your review..."
                              value={
                                reviewData[foodId]
                                  ?.comment || ''
                              }
                              onChange={(event) =>
                                handleCommentChange(
                                  foodId,
                                  event.target.value
                                )
                              }
                            />

                            <button
                              type="button"
                              onClick={() =>
                                submitReview(foodId)
                              }
                              disabled={
                                submittingReview[foodId]
                              }
                            >
                              {submittingReview[foodId]
                                ? 'Submitting...'
                                : 'Submit Review'}
                            </button>

                            {reviewMessage[foodId] && (
                              <p className="review-message">
                                {reviewMessage[foodId]}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>

                <div className="order-card-footer">
                  <span>Total</span>

                  <strong>
                    ₦{order.totalAmount.toLocaleString()}
                  </strong>
                </div>
              </article>
            )
          })}
        </section>
      )}
    </main>
  )
}

export default MyOrders