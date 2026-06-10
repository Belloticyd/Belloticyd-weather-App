


import { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

const API_URL = 'http://localhost:8000/api'

function FavoriteButton({ city, onFavoriteChange }) {
    const [isFavorite, setIsFavorite] = useState(false)
    const [loading, setLoading] = useState(false)
    const { isAuthenticated, token } = useAuth()

    const checkIfFavorite = async () => {
        if (!city || !isAuthenticated) return
        
        try {
            console.log('🔍 Checking if favorite:', city)
            const response = await axios.get(`${API_URL}/favorites`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            const favorites = response.data.data?.favorites || []
            setIsFavorite(favorites.includes(city))
        } catch (error) {
            console.error('Check favorite error:', error)
            setIsFavorite(false)
        }
    }

    const handleAddFavorite = async () => {
        console.log('⭐ ADD FAVORITE CLICKED!')
        console.log('City:', city)
        console.log('Token exists:', !!token)
        
        if (!isAuthenticated) {
            alert('Please login to save favorites')
            return
        }
        
        setLoading(true)
        try {
            const response = await axios.post(`${API_URL}/favorites`, { city }, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            console.log('Add response:', response.data)
            setIsFavorite(true)
            window.dispatchEvent(new Event('favoritesUpdated'))
            if (onFavoriteChange) onFavoriteChange()
        } catch (error) {
            console.error('Add error:', error)
            alert(error.response?.data?.message || 'Failed to add favorite')
        } finally {
            setLoading(false)
        }
    }

    const handleRemoveFavorite = async () => {
        console.log('🗑️ REMOVE FAVORITE CLICKED!')
        console.log('City:', city)
        console.log('Token exists:', !!token)

        setLoading(true)
        try {
            await axios.delete(`${API_URL}/favorites/${encodeURIComponent(city)}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            setIsFavorite(false)
            window.dispatchEvent(new Event('favoritesUpdated'))
            if (onFavoriteChange) onFavoriteChange()
        } catch (error) {
            console.error('Remove error:', error)
            alert(error.response?.data?.message || 'Failed to remove favorite')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (isAuthenticated && token && city) {
            checkIfFavorite()
        }
    }, [isAuthenticated, token, city])

    if (!isAuthenticated) return null

    return (
        <button
            onClick={isFavorite ? handleRemoveFavorite : handleAddFavorite}
            disabled={loading}
            style={{
                background: 'none',
                border: 'none',
                fontSize: '28px',
                cursor: 'pointer',
                padding: '8px',
                marginLeft: '10px',
                color: isFavorite ? '#fbbf24' : '#9ca3af',
                zIndex: 9999,
                position: 'relative'
            }}
            onMouseEnter={() => console.log('Mouse entered button')}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
            {loading ? '⏳' : (isFavorite ? '⭐' : '☆')}
        </button>
    )
}

export default FavoriteButton