

// Below code are the imported libraries 
import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode"


// Below code is used to create a AuthContext
const AuthContext = createContext(null);

// below code is used to use auth context function
export const useAuthContext = () => {
    return useContext(AuthContext)
}

// Below code is the backend API END Point
const API_URL = "http://localhost:8000/api"


// Below code is used to create a AuthProvider function
export const AuthProvider = ({ children }) => {

    // Below code is the useState
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [token, setToken] = useState(localStorage.getItem('token'))


    // Below code is used to Configure axios to always send token
    axios.interceptors.request.use((config) => {

        const token = localStorage.getItem("token")
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    })


    // Below code is used to Check if user is logged in on page load using useEffect
    useEffect(() => {

        // Below code is used to create a function that check Auth User
        const checkAuth = async () => {

            const storedToken = localStorage.getItem('token')
            if (storedToken) {
                try {
                    // Decode token to get user info
                    const decoded = jwtDecode(storedToken)
                    
                    // Check if token is expired
                    if (decoded.exp * 1000 < Date.now()) {

                        localStorage.removeItem('token')
                        setUser(null)

                    } else {

                        // Get fresh user data from backend
                        const response = await axios.get(`${API_URL}/auth/profile`)
                        setUser(response.data.user)
                    }
                } catch (error) {
                    console.error('Auth error:', error)
                    localStorage.removeItem('token')
                    setUser(null)
                }
            }
            setLoading(false)
        }
    
        checkAuth()

    }, [])
    // End of useEffect


    // Below code is used to create Register user function
    const register = async (name, email, password) => {

        // Below code is the tryCatch block
        try {

            // Below code is used to get a response from the backend API END Point using axios
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


    //  Below code is used to create Login user function
    const login = async (email, password) => {

        // Below code is the tryCatch block
        try {
            
            const response = await axios.post(`${API_URL}/auth/login`, {
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
                error: error.response?.data?.message || 'Login failed' 
            }
        }

    }


    // Logout user
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
        isAuthenticated: !!user
    }


    return (
        <AuthContext.Provider value={value}>
        {children}
        </AuthContext.Provider>
    )
}


export default AuthProvider