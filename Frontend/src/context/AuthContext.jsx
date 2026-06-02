import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'
import { jwtDecode } from 'jwt-decode'

// Create context
const AuthContext = createContext()

// Custom hook to use auth context
export const useAuth = () => useContext(AuthContext)

// API endpoint
const API_URL = 'http://localhost:8000/api'

// Configure axios defaults
axios.defaults.baseURL = API_URL

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState(localStorage.getItem('token'))

  // Configure axios interceptor to add token to every request
  useEffect(() => {
    const interceptor = axios.interceptors.request.use(
      (config) => {
        const currentToken = localStorage.getItem('token')
        if (currentToken) {
          config.headers.Authorization = `Bearer ${currentToken}`
        }
        return config
      },
      (error) => Promise.reject(error)
    )

    return () => axios.interceptors.request.eject(interceptor)
  }, [])

  // Check if user is logged in on page load
  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('token')
      console.log('Checking auth, token exists:', !!storedToken)
      
      if (storedToken) {
        try {
          // Decode token to get user info
          const decoded = jwtDecode(storedToken)
          console.log('Decoded token:', decoded)
          
          // Check if token is expired
          if (decoded.exp * 1000 < Date.now()) {
            console.log('Token expired')
            localStorage.removeItem('token')
            setUser(null)
            setToken(null)
          } else {
            // Get fresh user data from backend
            const response = await axios.get(`${API_URL}/auth/profile`)
            console.log('Profile response:', response.data)
            setUser(response.data.user)
            setToken(storedToken)
          }
        } catch (error) {
          console.error('Auth check error:', error)
          localStorage.removeItem('token')
          setUser(null)
          setToken(null)
        }
      }
      setLoading(false)
    }
    
    checkAuth()
  }, [])

  // Register user
  const register = async (name, email, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, {
        name,
        email,
        password
      })
      
      const { token, user } = response.data
      localStorage.setItem('token', token)
      setToken(token)
      setUser(user)
      
      return { success: true, user }
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Registration failed' 
      }
    }
  }

  // Login user
  const login = async (email, password) => {
    try {
      console.log('Attempting login for:', email)
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password
      })
      
      console.log('Login response:', response.data)
      
      const { token, user: userData } = response.data
      
      // Save token to localStorage
      localStorage.setItem('token', token)
      
      // Update state
      setToken(token)
      setUser(userData)
      
      // Configure axios default header for future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      
      return { success: true, user: userData }
    } catch (error) {
      console.error('Login error:', error.response?.data)
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed' 
      }
    }
  }

  // Logout user
  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
    // Force a re-render by setting state
    setUser(null)
  }

  const value = {
    user,
    token,
    loading,
    register,
    login,
    logout,
    isAuthenticated: !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}