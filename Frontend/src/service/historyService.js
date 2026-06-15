


import axios from 'axios'

// const API_URL = 'http://localhost:8000/api'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

// Get user's search history
export const getHistory = async () => {
    const token = localStorage.getItem('token')
    const response = await axios.get(`${API_URL}/history`, {
        headers: { 'Authorization': `Bearer ${token}` }
    })
    return response.data.data?.history || []
}

// Add to search history
export const addToHistory = async (city, weatherData) => {
    const token = localStorage.getItem('token')
    const response = await axios.post(`${API_URL}/history`, { city, weatherData }, {
        headers: { 'Authorization': `Bearer ${token}` }
    })
    return response.data.data?.history || []
}

// Remove a city from history
export const removeFromHistory = async (city) => {
    const token = localStorage.getItem('token')
    const response = await axios.delete(`${API_URL}/history/${encodeURIComponent(city)}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    })
    return response.data.data?.history || []
}

// Clear all search history
export const clearHistory = async () => {
    const token = localStorage.getItem('token')
    const response = await axios.delete(`${API_URL}/history`, {
        headers: { 'Authorization': `Bearer ${token}` }
    })
    return response.data.data?.history || []
}