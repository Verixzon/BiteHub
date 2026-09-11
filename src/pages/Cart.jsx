import { Link } from 'react-router-dom'
import { useCart } from '../services/CartContext.jsx'

function Cart() {
  const {
    cartItems,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
  } = useCart()

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

  const deliveryFee = cartItems.length > 0 ? 1000 : 0
  const total = subtotal + deliveryFee

  return (
    <main className="cart-page">
      <section className="cart-header">
        <p>YOUR ORDER</p>
        <h1>Shopping Cart</h1>
      </section>

      {cartItems.length === 0 ? (
        <section className="empty-cart">
          <h2>Your cart is empty</h2>

          <p>
            You haven't added any meals yet.
          </p>

          <Link
            to="/menu"
            className="browse-menu-button"
          >
            Explore Menu
          </Link>
        </section>
      ) : (
        <div className="cart-layout">
          <section className="cart-items-section">
            <h2>Your Items</h2>

            <div className="cart-items">
              {cartItems.map((item) => (
                <article
                  className="cart-item"
                  key={item._id}
                >
                  <div className="cart-item-image">
                    <img
                      src={item.image}
                      alt={item.name}
                    />
                  </div>

                  <div className="cart-item-info">
                    <p>{item.category}</p>

                    <h3>{item.name}</h3>

                    <span>
                      ₦{item.price.toLocaleString()} each
                    </span>
                  </div>

                  <div className="quantity-controls">
                    <button
                      type="button"
                      onClick={() =>
                        decreaseQuantity(item._id)
                      }
                    >
                      −
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      type="button"
                      onClick={() =>
                        increaseQuantity(item._id)
                      }
                    >
                      +
                    </button>
                  </div>

                  <strong className="cart-item-total">
                    ₦{(
                      item.price * item.quantity
                    ).toLocaleString()}
                  </strong>

                  <button
                    type="button"
                    className="remove-button"
                    onClick={() =>
                      removeFromCart(item._id)
                    }
                  >
                    Remove
                  </button>
                </article>
              ))}
            </div>

            <Link
              to="/menu"
              className="continue-shopping"
            >
              ← Continue Shopping
            </Link>
          </section>

          <aside className="order-summary">
            <h2>Order Summary</h2>

            <div className="summary-row">
              <span>Subtotal</span>

              <strong>
                ₦{subtotal.toLocaleString()}
              </strong>
            </div>

            <div className="summary-row">
              <span>Delivery Fee</span>

              <strong>
                ₦{deliveryFee.toLocaleString()}
              </strong>
            </div>

            <div className="summary-divider"></div>

            <div className="summary-total">
              <span>Total</span>

              <strong>
                ₦{total.toLocaleString()}
              </strong>
            </div>

            <Link
              to="/checkout"
              className="checkout-button"
            >
              Proceed to Checkout
            </Link>
          </aside>
        </div>
      )}
    </main>
  )
}

export default Cart