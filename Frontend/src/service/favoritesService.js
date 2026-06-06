


import axios from 'axios'

const API_URL = 'http://localhost:8000/api'

// Get user's favorite cities
export const getFavorites = async () => {
    try {
        const response = await axios.get(`${API_URL}/favorites`)
        return response.data.data.favorites
    } catch (error) {
        console.error('Getting favorites error:', error)
        throw error
    }
}

// Add city to favorites
export const addFavorite = async (city) => {
    try {
        const response = await axios.post(`${API_URL}/favorites`, { city })
        return response.data.data.favorites
    } catch (error) {
        console.error('Add favorite error:', error)
        throw error
    }
}

// Remove city from favorites
export const removeFavorite = async (city) => {
    try {
        const response = await axios.delete(`${API_URL}/favorites/${encodeURIComponent(city)}`)
        return response.data.data.favorites
    } catch (error) {
        console.error('Remove favorite error:', error)
        throw error
    }
}