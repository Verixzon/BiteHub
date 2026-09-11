import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../services/AuthContext.jsx'

function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false,
  })

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target

    setFormData((currentData) => ({
      ...currentData,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    setError('')
    setLoading(true)

    try {
      const response = await fetch(
        'https://bitehub-emzx.onrender.com/api/auth/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || 'Login failed.')
        return
      }

      login(data.user, data.token)

      alert(`Welcome back, ${data.user.name}!`)

      navigate('/')
    } catch (error) {
      setError('Unable to connect to the server.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-header">
          <p>WELCOME BACK</p>

          <h1>Login to BiteHub</h1>

          <span>
            Sign in to continue ordering your favourite meals.
          </span>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {error && (
            <p className="auth-error">
              {error}
            </p>
          )}

          <label>
            Email Address

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </label>

          <label>
            Password

            <div className="password-field">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </label>

          <div className="auth-options">
            <label className="remember-me">
              <input
                type="checkbox"
                name="remember"
                checked={formData.remember}
                onChange={handleChange}
              />

              <span>Remember me</span>
            </label>

            <span className="forgot-password">
              Forgot password?
            </span>
          </div>

          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Don't have an account?{' '}
            <Link to="/register">
              Create an account
            </Link>
          </p>
        </div>
      </section>
    </main>
  )
}

export default Login