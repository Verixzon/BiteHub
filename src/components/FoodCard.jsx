import { useEffect, useState } from 'react'
import { useCart } from '../services/CartContext.jsx'

function FoodCard({ food, ...foodProps }) {
  const { addToCart } = useCart()

  const item = food || foodProps

  const [reviews, setReviews] = useState([])
  const [averageRating, setAverageRating] = useState(0)
  const [reviewCount, setReviewCount] = useState(0)
  const [showReviews, setShowReviews] = useState(false)

  const [editingReview, setEditingReview] = useState(null)
  const [editRating, setEditRating] = useState(5)
  const [editComment, setEditComment] = useState('')

  const [reviewMessage, setReviewMessage] = useState('')

  useEffect(() => {
    loadReviews()
  }, [item._id])

  async function loadReviews() {
    try {
      const response = await fetch(
        `http://localhost:5000/api/reviews/food/${item._id}`
      )

      const data = await response.json()

      if (response.ok) {
        setReviews(data.reviews)
        setAverageRating(data.averageRating)
        setReviewCount(data.reviewCount)
      }
    } catch (error) {
      console.error('Failed to load reviews:', error)
    }
  }

  function startEditing(review) {
    setEditingReview(review._id)
    setEditRating(review.rating)
    setEditComment(review.comment)
    setReviewMessage('')
  }

  function cancelEditing() {
    setEditingReview(null)
    setEditRating(5)
    setEditComment('')
  }

  async function updateReview(reviewId) {
    const token = localStorage.getItem('bitehub-token')

    try {
      const response = await fetch(
        `http://localhost:5000/api/reviews/${reviewId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            rating: editRating,
            comment: editComment.trim(),
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        setReviewMessage(data.message || 'Failed to update review')
        return
      }

      setReviewMessage('Review updated successfully')
      setEditingReview(null)

      await loadReviews()
    } catch (error) {
      console.error(error)
      setReviewMessage('Unable to update review')
    }
  }

  async function deleteReview(reviewId) {
    const confirmed = window.confirm(
      'Are you sure you want to delete this review?'
    )

    if (!confirmed) return

    const token = localStorage.getItem('bitehub-token')

    try {
      const response = await fetch(
        `http://localhost:5000/api/reviews/${reviewId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data = await response.json()

      if (!response.ok) {
        setReviewMessage(data.message || 'Failed to delete review')
        return
      }

      setReviewMessage('Review deleted successfully')

      await loadReviews()
    } catch (error) {
      console.error(error)
      setReviewMessage('Unable to delete review')
    }
  }

  return (
    <article className="food-card">
      <div className="food-image">
        <img
          src={item.image}
          alt={item.name}
        />
      </div>

      <div className="food-info">
        <p>{item.category}</p>

        <h3>{item.name}</h3>

        {/* Rating Summary */}
        <div className="food-rating">
          {reviewCount > 0 ? (
            <>
              <span>★</span>
              <strong>{averageRating}</strong>
              <small>
                ({reviewCount}{' '}
                {reviewCount === 1 ? 'review' : 'reviews'})
              </small>
            </>
          ) : (
            <small>No reviews yet</small>
          )}
        </div>

        {/* View Reviews */}
        {reviewCount > 0 && (
          <button
            type="button"
            className="view-reviews-button"
            onClick={() => setShowReviews(!showReviews)}
          >
            {showReviews ? 'Hide Reviews' : 'View Reviews'}
          </button>
        )}

        {/* Reviews */}
        {showReviews && (
          <div className="food-reviews">
            {reviews.map((review) => (
              <div
                className="food-review"
                key={review._id}
              >
                {editingReview === review._id ? (
                  /* Edit Review */
                  <div className="edit-review">
                    <div className="edit-stars">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setEditRating(star)}
                        >
                          {editRating >= star ? '★' : '☆'}
                        </button>
                      ))}
                    </div>

                    <textarea
                      value={editComment}
                      onChange={(event) =>
                        setEditComment(event.target.value)
                      }
                    />

                    <div className="edit-review-actions">
                      <button
                        type="button"
                        onClick={() =>
                          updateReview(review._id)
                        }
                      >
                        Save Changes
                      </button>

                      <button
                        type="button"
                        onClick={cancelEditing}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="review-rating">
                      {'★'.repeat(review.rating)}
                      {'☆'.repeat(5 - review.rating)}
                    </div>

                    <strong>
                      {review.user?.name || 'Anonymous'}
                    </strong>

                    <p>{review.comment}</p>

                    <small>
                      {new Date(
                        review.createdAt
                      ).toLocaleDateString()}
                    </small>

                    {/* Review Actions */}
                    <div className="review-actions">
                      <button
                        type="button"
                        onClick={() =>
                          startEditing(review)
                        }
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          deleteReview(review._id)
                        }
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}

        {reviewMessage && (
          <p className="review-message">
            {reviewMessage}
          </p>
        )}

        <div className="food-card-bottom">
          <strong>
            ₦{item.price.toLocaleString()}
          </strong>

          <button
            type="button"
            onClick={() => addToCart(item)}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </article>
  )
}

export default FoodCard