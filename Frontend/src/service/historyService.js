



import axios from 'axios'
import { API_URL } from '../config.js'

// Helper to get token
const getToken = () => localStorage.getItem('token')

// Get user's search history
export const getHistory = async () => {
    const token = getToken()
    const response = await axios.get(`${API_URL}/history`, {
        headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
    return response.data.data?.history || []
}

// Add to search history
export const addToHistory = async (city, weatherData) => {
    const token = getToken()
    const response = await axios.post(`${API_URL}/history`, 
        { city, weatherData },
        {
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        }
    )
    return response.data.data?.history || []
}

// Remove a city from history
export const removeFromHistory = async (city) => {
    const token = getToken()
    const response = await axios.delete(`${API_URL}/history/${encodeURIComponent(city)}`, {
        headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
    return response.data.data?.history || []
}

// Clear all search history
export const clearHistory = async () => {
    const token = getToken()
    const response = await axios.delete(`${API_URL}/history`, {
        headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
    return response.data.data?.history || []
}