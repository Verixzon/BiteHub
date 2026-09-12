import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <h2>BiteHub</h2>

          <p>
            Delicious meals, convenient ordering, and secure
            online payments — all in one place.
          </p>
        </div>

        <div className="footer-links">
          <h3>Quick Links</h3>

          <Link to="/">Home</Link>
          <Link to="/menu">Menu</Link>
          <Link to="/cart">Cart</Link>
          <Link to="/orders">My Orders</Link>
        </div>

        <div className="footer-contact">
          <h3>Contact</h3>

          <p>Have a question or need help?</p>

          <a href="mailto:bitehub1000@gmail.com">
            bitehub1000@gmail.com
          </a>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          © {new Date().getFullYear()} BiteHub. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

export default Footer