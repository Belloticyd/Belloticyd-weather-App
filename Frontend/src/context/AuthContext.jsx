


import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'
import { jwtDecode } from 'jwt-decode'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

const API_URL = 'http://localhost:8000/api'

// Add request timeout
axios.defaults.timeout = 10000

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Configure axios interceptor
  useEffect(() => {
    const interceptor = axios.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token')
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => Promise.reject(error)
    )

    return () => axios.interceptors.request.eject(interceptor)
  }, [])

  const checkAuth = async () => {
    const storedToken = localStorage.getItem('token')
    
    if (!storedToken) {
      setLoading(false)
      return
    }

    try {
      const decoded = jwtDecode(storedToken)
      
      if (decoded.exp * 1000 < Date.now()) {
        localStorage.removeItem('token')
        setUser(null)
        setLoading(false)
        return
      }

      const response = await axios.get(`${API_URL}/auth/profile`)
      setUser(response.data.data?.user || response.data.user)
    } catch (error) {
      console.error('Auth error:', error)
      localStorage.removeItem('token')
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkAuth()
  }, [])

  const register = async (name, email, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, {
        name, email, password
      })
      
      const token = response.data.data?.token || response.data.token
      const userData = response.data.data?.user || response.data.user
      
      localStorage.setItem('token', token)
      setUser(userData)
      
      return { success: true, user: userData }
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Registration failed' 
      }
    }
  }

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { email, password })
      
      const token = response.data.data?.token || response.data.token
      const userData = response.data.data?.user || response.data.user
      
      localStorage.setItem('token', token)
      setUser(userData)
      
      return { success: true, user: userData }
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed' 
      }
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  const value = {
    user,
    loading,
    error,
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
