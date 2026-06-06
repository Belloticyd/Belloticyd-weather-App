


import { useState, useEffect } from 'react'
import { addFavorite, removeFavorite, getFavorites } from '../service/favoritesService'
import { useAuth } from '../context/AuthContext'

function FavoriteButton({ city, onFavoriteChange }) {
    const [isFavorite, setIsFavorite] = useState(false)
    const [loading, setLoading] = useState(false)
    const { isAuthenticated } = useAuth()

    // Check if city is in favorites when component mounts or auth changes
    useEffect(() => {
        if (isAuthenticated && city) {
            checkIfFavorite()
        }
    }, [isAuthenticated, city])

    const checkIfFavorite = async () => {
        try {
            const favorites = await getFavorites()
            setIsFavorite(favorites.includes(city))
        } catch (error) {
            console.error('Check favorite error:', error)
        }
    }

    const handleToggleFavorite = async () => {
        if (!isAuthenticated) {
            alert('Please login to save favorites')
            return
        }

        setLoading(true)
        try {
            if (isFavorite) {
                await removeFavorite(city)
                setIsFavorite(false)
            } else {
                await addFavorite(city)
                setIsFavorite(true)
            }
            if (onFavoriteChange) onFavoriteChange()
        } catch (error) {
            console.error('Toggle favorite error:', error)
            alert(error.response?.data?.message || 'Failed to update favorites')
        } finally {
            setLoading(false)
        }
    }

    if (!isAuthenticated) {
        return null
    }

    return (
        <button
            onClick={handleToggleFavorite}
            disabled={loading}
            className={`p-2 rounded-full transition-colors cursor-pointer ${
                isFavorite 
                    ? 'text-yellow-500 hover:text-yellow-600' 
                    : 'text-gray-400 hover:text-yellow-500'
            }`}
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
            {loading ? '⏳' : (isFavorite ? 'Add to Favorites ⭐' : 'Remove from Favorites ☆')}
        </button>
    )
}



export default FavoriteButton