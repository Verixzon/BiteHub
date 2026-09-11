import { createContext, useContext, useState } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('bitehub-user')

    return savedUser ? JSON.parse(savedUser) : null
  })

  const login = (userData, token) => {
    localStorage.setItem(
      'bitehub-user',
      JSON.stringify(userData)
    )

    localStorage.setItem('bitehub-token', token)

    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem('bitehub-user')
    localStorage.removeItem('bitehub-token')

    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}