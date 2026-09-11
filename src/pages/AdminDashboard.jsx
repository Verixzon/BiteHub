import { useEffect, useState } from 'react'

const API_URL = import.meta.env.VITE_API_URL

function AdminDashboard() {
  const [orders, setOrders] = useState([])
  const [foods, setFoods] = useState([])
  const [users, setUsers] = useState([])
  const [reviews, setReviews] = useState([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [showFoodForm, setShowFoodForm] = useState(false)
  const [editingFood, setEditingFood] = useState(null)

  const [foodForm, setFoodForm] = useState({
    name: '',
    category: '',
    price: '',
    image: '',
  })

  useEffect(() => {
    loadDashboard()
  }, [])

  async function loadDashboard() {
    try {
      const token = localStorage.getItem('bitehub-token')

      const [
        ordersResponse,
        foodsResponse,
        reviewsResponse,
        usersResponse,
      ] = await Promise.all([
        fetch(
          `${API_URL}/api/orders/admin/all`,
          {
            cache: 'no-store',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        ),

        fetch(`${API_URL}/api/foods`, {
          cache: 'no-store',
        }),

        fetch(
          `${API_URL}/api/reviews/admin/all`,
          {
            cache: 'no-store',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        ),

        fetch(
          `${API_URL}/api/users/admin/all`,
          {
            cache: 'no-store',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        ),
      ])

      const ordersData = await ordersResponse.json()
      const foodsData = await foodsResponse.json()
      const reviewsData = await reviewsResponse.json()
      const usersData = await usersResponse.json()

      if (!ordersResponse.ok) {
        setError(
          ordersData.message ||
            'Failed to load orders.'
        )
        return
      }

      if (!foodsResponse.ok) {
        setError(
          foodsData.message ||
            'Failed to load foods.'
        )
        return
      }

      if (!reviewsResponse.ok) {
        setError(
          reviewsData.message ||
            'Failed to load reviews.'
        )
        return
      }

      if (!usersResponse.ok) {
        setError(
          usersData.message ||
            'Failed to load users.'
        )
        return
      }

      setOrders(ordersData)
      setFoods(foodsData)
      setReviews(reviewsData)
      setUsers(usersData)
    } catch (error) {
      setError('Unable to connect to the server.')
    } finally {
      setLoading(false)
    }
  }

  async function updateStatus(orderId, status) {
    try {
      const token = localStorage.getItem('bitehub-token')

      const response = await fetch(
        `${API_URL}/api/orders/admin/${orderId}/status`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        alert(
          data.message ||
            'Failed to update status.'
        )
        return
      }

      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order._id === orderId
            ? {
                ...order,
                status: data.order.status,
              }
            : order
        )
      )
    } catch (error) {
      alert('Unable to connect to the server.')
    }
  }

  function handleFoodChange(event) {
    const { name, value } = event.target

    setFoodForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }))
  }

  function openAddFoodForm() {
    setEditingFood(null)

    setFoodForm({
      name: '',
      category: '',
      price: '',
      image: '',
    })

    setShowFoodForm(true)
  }

  function openEditFoodForm(food) {
    setEditingFood(food)

    setFoodForm({
      name: food.name,
      category: food.category,
      price: food.price,
      image: food.image,
    })

    setShowFoodForm(true)
  }

  function closeFoodForm() {
    setShowFoodForm(false)
    setEditingFood(null)
  }

  async function handleFoodSubmit(event) {
    event.preventDefault()

    try {
      const token = localStorage.getItem('bitehub-token')

      const url = editingFood
        ? `${API_URL}/api/foods/${editingFood._id}`
        : `${API_URL}/api/foods`

      const response = await fetch(url, {
        method: editingFood ? 'PATCH' : 'POST',

        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          name: foodForm.name,
          category: foodForm.category,
          price: Number(foodForm.price),
          image: foodForm.image,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        alert(
          data.message ||
            'Failed to save food.'
        )
        return
      }

      if (editingFood) {
        setFoods((currentFoods) =>
          currentFoods.map((food) =>
            food._id === editingFood._id
              ? data.food
              : food
          )
        )
      } else {
        setFoods((currentFoods) => [
          data.food,
          ...currentFoods,
        ])
      }

      closeFoodForm()
    } catch (error) {
      alert('Unable to connect to the server.')
    }
  }

  async function deleteFood(foodId) {
    const confirmed = window.confirm(
      'Are you sure you want to delete this food?'
    )

    if (!confirmed) {
      return
    }

    try {
      const token = localStorage.getItem('bitehub-token')

      const response = await fetch(
        `${API_URL}/api/foods/${foodId}`,
        {
          method: 'DELETE',

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data = await response.json()

      if (!response.ok) {
        alert(
          data.message ||
            'Failed to delete food.'
        )
        return
      }

      setFoods((currentFoods) =>
        currentFoods.filter(
          (food) => food._id !== foodId
        )
      )
    } catch (error) {
      alert('Unable to connect to the server.')
    }
  }

  async function deleteReview(reviewId) {
    const confirmed = window.confirm(
      'Are you sure you want to delete this review?'
    )

    if (!confirmed) {
      return
    }

    try {
      const token = localStorage.getItem('bitehub-token')

      const response = await fetch(
        `${API_URL}/api/reviews/admin/${reviewId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data = await response.json()

      if (!response.ok) {
        alert(
          data.message ||
            'Failed to delete review.'
        )
        return
      }

      setReviews((currentReviews) =>
        currentReviews.filter(
          (review) =>
            review._id !== reviewId
        )
      )
    } catch (error) {
      alert('Unable to connect to the server.')
    }
  }

  async function deleteUser(userId) {
    const confirmed = window.confirm(
      'Are you sure you want to delete this user?'
    )

    if (!confirmed) {
      return
    }

    try {
      const token = localStorage.getItem('bitehub-token')

      const response = await fetch(
        `${API_URL}/api/users/admin/${userId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data = await response.json()

      if (!response.ok) {
        alert(
          data.message ||
            'Failed to delete user.'
        )
        return
      }

      setUsers((currentUsers) =>
        currentUsers.filter(
          (user) => user._id !== userId
        )
      )
    } catch (error) {
      alert('Unable to connect to the server.')
    }
  }

  async function updateUserRole(userId, role) {
    try {
      const token = localStorage.getItem('bitehub-token')

      const response = await fetch(
        `${API_URL}/api/users/admin/${userId}/role`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            role,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        alert(
          data.message ||
            'Failed to update user role.'
        )
        return
      }

      setUsers((currentUsers) =>
        currentUsers.map((user) =>
          user._id === userId
            ? data.user
            : user
        )
      )

      alert('User role updated successfully.')
    } catch (error) {
      console.error(error)
      alert('Unable to connect to the server.')
    }
  }

  function scrollToSection(sectionId) {
    const section =
      document.getElementById(sectionId)

    if (section) {
      section.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }
  }

  const getStatusLabel = (status) => {
    return status
      .replaceAll('-', ' ')
      .replace(/\b\w/g, (letter) =>
        letter.toUpperCase()
      )
  }

  if (loading) {
    return (
      <main className="admin-page">
        <p>Loading admin dashboard...</p>
      </main>
    )
  }

  if (error) {
    return (
      <main className="admin-page">
        <p>{error}</p>
      </main>
    )
  }

  return (
    <main className="admin-page">
      <section className="admin-header">
        <p>ADMINISTRATION</p>

        <h1>Admin Dashboard</h1>

        <span>
          Manage BiteHub orders, foods, reviews,
          users and delivery status.
        </span>
      </section>

      {/* Admin Navigation */}

      <nav className="admin-navigation">
        <button
          type="button"
          onClick={() =>
            scrollToSection('admin-orders')
          }
        >
          Orders
        </button>

        <button
          type="button"
          onClick={() =>
            scrollToSection('admin-foods')
          }
        >
          Foods
        </button>

        <button
          type="button"
          onClick={() =>
            scrollToSection('admin-reviews')
          }
        >
          Reviews
        </button>

        <button
          type="button"
          onClick={() =>
            scrollToSection('admin-users')
          }
        >
          Users
        </button>
      </nav>

      {/* Statistics */}

      <section className="admin-stats">
        <div className="admin-stat-card">
          <span>Total Orders</span>
          <strong>{orders.length}</strong>
        </div>

        <div className="admin-stat-card">
          <span>Pending</span>
          <strong>
            {
              orders.filter(
                (order) =>
                  order.status === 'pending'
              ).length
            }
          </strong>
        </div>

        <div className="admin-stat-card">
          <span>Preparing</span>
          <strong>
            {
              orders.filter(
                (order) =>
                  order.status === 'preparing'
              ).length
            }
          </strong>
        </div>

        <div className="admin-stat-card">
          <span>Delivered</span>
          <strong>
            {
              orders.filter(
                (order) =>
                  order.status === 'delivered'
              ).length
            }
          </strong>
        </div>

        <div className="admin-stat-card">
          <span>Total Reviews</span>
          <strong>{reviews.length}</strong>
        </div>

        <div className="admin-stat-card">
          <span>Total Users</span>
          <strong>{users.length}</strong>
        </div>
      </section>

      {/* Orders */}

      <section
        className="admin-orders"
        id="admin-orders"
      >
        <h2>All Orders</h2>

        {orders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          orders.map((order) => (
            <article
              className="admin-order-card"
              key={order._id}
            >
              <div className="admin-order-info">
                <div>
                  <p>ORDER</p>

                  <h3>
                    #{order._id
                      .slice(-6)
                      .toUpperCase()}
                  </h3>
                </div>

                <div>
                  <p>CUSTOMER</p>

                  <strong>
                    {order.user?.name ||
                      'Unknown customer'}
                  </strong>

                  <span>
                    {order.user?.email || ''}
                  </span>
                </div>

                <div>
                  <p>TOTAL</p>

                  <strong>
                    ₦
                    {order.totalAmount.toLocaleString()}
                  </strong>
                </div>

                <div>
                  <p>STATUS</p>

                  <strong>
                    {getStatusLabel(
                      order.status
                    )}
                  </strong>
                </div>
              </div>

              <div className="admin-order-items">
                {order.items.map(
                  (item, index) => (
                    <div
                      key={`${order._id}-${index}`}
                    >
                      <span>
                        {item.name} ×{' '}
                        {item.quantity}
                      </span>

                      <strong>
                        ₦
                        {(
                          item.price *
                          item.quantity
                        ).toLocaleString()}
                      </strong>
                    </div>
                  )
                )}
              </div>

              <div className="admin-status-controls">
                <label
                  htmlFor={`status-${order._id}`}
                >
                  Update Status
                </label>

                <select
                  id={`status-${order._id}`}
                  value={order.status}
                  onChange={(event) =>
                    updateStatus(
                      order._id,
                      event.target.value
                    )
                  }
                >
                  <option value="pending">
                    Pending
                  </option>

                  <option value="confirmed">
                    Confirmed
                  </option>

                  <option value="preparing">
                    Preparing
                  </option>

                  <option value="out-for-delivery">
                    Out for Delivery
                  </option>

                  <option value="delivered">
                    Delivered
                  </option>

                  <option value="cancelled">
                    Cancelled
                  </option>
                </select>
              </div>
            </article>
          ))
        )}
      </section>

      {/* Food Management */}

      <section
        className="admin-foods"
        id="admin-foods"
      >
        <div className="admin-section-header">
          <div>
            <p>MENU MANAGEMENT</p>
            <h2>Foods</h2>
          </div>

          <button
            type="button"
            onClick={openAddFoodForm}
          >
            + Add Food
          </button>
        </div>

        {showFoodForm && (
          <form
            className="admin-food-form"
            onSubmit={handleFoodSubmit}
          >
            <h3>
              {editingFood
                ? 'Edit Food'
                : 'Add New Food'}
            </h3>

            <input
              type="text"
              name="name"
              placeholder="Food name"
              value={foodForm.name}
              onChange={handleFoodChange}
              required
            />

            <input
              type="text"
              name="category"
              placeholder="Category"
              value={foodForm.category}
              onChange={handleFoodChange}
              required
            />

            <input
              type="number"
              name="price"
              placeholder="Price"
              value={foodForm.price}
              onChange={handleFoodChange}
              min="0"
              required
            />

            <input
              type="text"
              name="image"
              placeholder="Image filename e.g. jollof-rice.jpg"
              value={foodForm.image}
              onChange={handleFoodChange}
            />

            <div className="admin-food-form-actions">
              <button type="submit">
                {editingFood
                  ? 'Update Food'
                  : 'Add Food'}
              </button>

              <button
                type="button"
                onClick={closeFoodForm}
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        <div className="admin-food-list">
          {foods.map((food) => (
            <article
              className="admin-food-card"
              key={food._id}
            >
              <div>
                <p>{food.category}</p>

                <h3>{food.name}</h3>

                <strong>
                  ₦{food.price.toLocaleString()}
                </strong>
              </div>

              <div className="admin-food-actions">
                <button
                  type="button"
                  onClick={() =>
                    openEditFoodForm(food)
                  }
                >
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() =>
                    deleteFood(food._id)
                  }
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Review Management */}

      <section
        className="admin-reviews"
        id="admin-reviews"
      >
        <div className="admin-section-header">
          <div>
            <p>REVIEW MANAGEMENT</p>
            <h2>Customer Reviews</h2>
          </div>
        </div>

        {reviews.length === 0 ? (
          <p>No reviews found.</p>
        ) : (
          <div className="admin-review-list">
            {reviews.map((review) => (
              <article
                className="admin-review-card"
                key={review._id}
              >
                <div className="admin-review-info">
                  <div>
                    <p>FOOD</p>

                    <h3>
                      {review.food?.name ||
                        'Unknown food'}
                    </h3>
                  </div>

                  <div>
                    <p>CUSTOMER</p>

                    <strong>
                      {review.user?.name ||
                        'Unknown customer'}
                    </strong>

                    <span>
                      {review.user?.email || ''}
                    </span>
                  </div>

                  <div>
                    <p>RATING</p>

                    <strong className="admin-review-stars">
                      {'★'.repeat(review.rating)}
                      {'☆'.repeat(
                        5 - review.rating
                      )}
                    </strong>
                  </div>
                </div>

                <div className="admin-review-comment">
                  <p>{review.comment}</p>

                  <small>
                    {new Date(
                      review.createdAt
                    ).toLocaleDateString()}
                  </small>
                </div>

                <div className="admin-review-actions">
                  <button
                    type="button"
                    onClick={() =>
                      deleteReview(review._id)
                    }
                  >
                    Delete Review
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* User Management */}

      <section
        className="admin-users"
        id="admin-users"
      >
        <div className="admin-section-header">
          <div>
            <p>USER MANAGEMENT</p>
            <h2>Registered Users</h2>
          </div>
        </div>

        {users.length === 0 ? (
          <p>No users found.</p>
        ) : (
          <div className="admin-user-list">
            {users.map((user) => (
              <article
                className="admin-user-card"
                key={user._id}
              >
                <div className="admin-user-info">
                  <div>
                    <p>NAME</p>
                    <h3>{user.name}</h3>
                  </div>

                  <div>
                    <p>EMAIL</p>
                    <span>{user.email}</span>
                  </div>

                  <div>
                    <p>PHONE</p>
                    <span>{user.phone}</span>
                  </div>

                  <div>
                    <p>ROLE</p>

                    <select
                      value={user.role}
                      onChange={(event) =>
                        updateUserRole(
                          user._id,
                          event.target.value
                        )
                      }
                    >
                      <option value="user">
                        User
                      </option>

                      <option value="admin">
                        Admin
                      </option>
                    </select>
                  </div>
                </div>

                <div className="admin-user-actions">
                  <button
                    type="button"
                    onClick={() =>
                      deleteUser(user._id)
                    }
                  >
                    Delete User
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

export default AdminDashboard