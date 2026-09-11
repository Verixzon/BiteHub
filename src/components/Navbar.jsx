import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../services/CartContext.jsx'
import { useAuth } from '../services/AuthContext.jsx'

function Navbar() {
  const { cartItems } = useCart()
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const cartCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  )

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        BiteHub
      </Link>

      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/menu">Menu</Link>
        <Link to="/cart">Cart ({cartCount})</Link>

        {user ? (
          <>
            <Link to="/orders">My Orders</Link>

            {user.role === 'admin' && (
  <Link to="/admin">Admin Dashboard</Link>
            )}
            
            <span>Hi, {user.name}</span>

            <button
              type="button"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar