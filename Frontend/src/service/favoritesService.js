


import axios from 'axios'
import { API_URL } from '../config'

// Helper to get token
const getToken = () => localStorage.getItem('token')

// Get user's favorite cities
export const getFavorites = async () => {
    try {
        const token = getToken()
        const response = await axios.get(`${API_URL}/favorites`, {
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
        return response.data.data?.favorites || []
    } catch (error) {
        console.error('Getting favorites error:', error)
        throw error
    }
}

// Add city to favorites
export const addFavorite = async (city) => {
    try {
        const token = getToken()
        const response = await axios.post(`${API_URL}/favorites`, 
            { city },
            {
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        )
        return response.data.data?.favorites || []
    } catch (error) {
        console.error('Add favorite error:', error)
        throw error
    }
}

// Remove city from favorites
export const removeFavorite = async (city) => {
    try {
        const token = getToken()
        const response = await axios.delete(`${API_URL}/favorites/${encodeURIComponent(city)}`, {
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
        return response.data.data?.favorites || []
    } catch (error) {
        console.error('Remove favorite error:', error)
        throw error
    }
}

export default {
    getFavorites,
    addFavorite,
    removeFavorite
}