


import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'
import { jwtDecode } from 'jwt-decode'

// Create context
const AuthContext = createContext()

// Custom hook to use auth context
export const useAuth = () => useContext(AuthContext)

// API endpoint - CHANGE THIS TO MATCH YOUR BACKEND PORT
const API_URL = 'http://localhost:8000/api'

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Configure axios to always send token
  axios.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  })

  // Check if user is logged in on page load
  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('token')
      console.log('🔍 Checking auth, token exists:', !!storedToken)
      
      if (storedToken) {
        try {
          // Decode token to get user info
          const decoded = jwtDecode(storedToken)
          console.log('📝 Decoded token:', decoded)
          
          // Check if token is expired
          if (decoded.exp * 1000 < Date.now()) {
            console.log('⏰ Token expired')
            localStorage.removeItem('token')
            setUser(null)
          } else {
            // Get fresh user data from backend
            const response = await axios.get(`${API_URL}/auth/profile`, {
              headers: { Authorization: `Bearer ${storedToken}` }
            })
            console.log('✅ User profile loaded:', response.data)
            
            // Handle nested user data
            const userData = response.data.user || response.data.data?.user
            setUser(userData)
          }
        } catch (error) {
          console.error('❌ Auth error:', error)
          localStorage.removeItem('token')
          setUser(null)
        }
      }
      setLoading(false)
    }
    
    checkAuth()
  }, [])

  // Register user
  const register = async (name, email, password) => {
    try {
      console.log('📝 Attempting registration for:', email)
      const response = await axios.post(`${API_URL}/auth/register`, {
        name,
        email,
        password
      })
      
      console.log('📦 Register response:', response.data)
      
      // Extract token and user from nested structure
      const token = response.data.data?.token
      const userData = response.data.data?.user
      
      if (!token) {
        console.error('❌ No token in response:', response.data)
        return { 
          success: false, 
          error: 'No token received from server' 
        }
      }
      
      console.log('✅ Registration successful, saving token')
      localStorage.setItem('token', token)
      setUser(userData)
      
      return { success: true, user: userData }
    } catch (error) {
      console.error('❌ Registration error:', error.response?.data || error.message)
      return { 
        success: false, 
        error: error.response?.data?.message || 'Registration failed' 
      }
    }
  }

  // Login user
  const login = async (email, password) => {
    try {
      console.log('📝 Attempting login for:', email)
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password
      })
      
      console.log('📦 Login response:', response.data)
      
      // Extract token and user from nested structure
      const token = response.data.data?.token
      const userData = response.data.data?.user
      
      if (!token) {
        console.error('❌ No token in response:', response.data)
        return { 
          success: false, 
          error: 'No token received from server' 
        }
      }
      
      console.log('✅ Login successful, saving token')
      localStorage.setItem('token', token)
      setUser(userData)
      
      return { success: true, user: userData }
    } catch (error) {
      console.error('❌ Login error:', error.response?.data || error.message)
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed' 
      }
    }
  }

  // Logout user
  const logout = () => {
    console.log('🚪 Logging out')
    localStorage.removeItem('token')
    setUser(null)
  }

  const value = {
    user,
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