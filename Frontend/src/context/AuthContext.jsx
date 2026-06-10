



import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'
import { jwtDecode } from 'jwt-decode'

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

const API_URL = 'http://localhost:8000/api'

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
            (error) => {
                return Promise.reject(error)
            }
        )

        return () => {
            axios.interceptors.request.eject(interceptor)
        }
    }, [])

    // Check if user is logged in on page load
    useEffect(() => {
        const checkAuth = async () => {
            const storedToken = localStorage.getItem('token')
            console.log('🔍 Checking auth, token exists:', !!storedToken)
            
            if (storedToken) {
                try {
                    const decoded = jwtDecode(storedToken)
                    
                    if (decoded.exp * 1000 < Date.now()) {
                        console.log('⏰ Token expired')
                        localStorage.removeItem('token')
                        setUser(null)
                        setToken(null)
                    } else {
                        // Get fresh user data
                        const response = await axios.get(`${API_URL}/auth/profile`)
                        console.log('✅ User profile loaded')
                        setUser(response.data.data?.user || response.data.user)
                        setToken(storedToken)
                    }
                } catch (error) {
                    console.error('❌ Auth error:', error)
                    localStorage.removeItem('token')
                    setUser(null)
                    setToken(null)
                }
            }
            setLoading(false)
        }
        
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
            setToken(token)
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
            const response = await axios.post(`${API_URL}/auth/login`, {
                email, password
            })
            
            const token = response.data.data?.token || response.data.token
            const userData = response.data.data?.user || response.data.user
            
            localStorage.setItem('token', token)
            setToken(token)
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
        setToken(null)
        setUser(null)
    }

    const value = {
        user,
        token,
        loading,
        register,
        login,
        logout,
        isAuthenticated: !!user && !!token
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}