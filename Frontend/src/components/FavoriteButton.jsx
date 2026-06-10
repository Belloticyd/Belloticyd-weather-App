



import { useState, useEffect } from 'react'
import { addFavorite, removeFavorite, getFavorites } from '../service/favoritesService'
import { useAuth } from '../context/AuthContext'

function FavoriteButton({ city, onFavoriteChange }) {
    const [isFavorite, setIsFavorite] = useState(false)
    const [loading, setLoading] = useState(false)
    const { isAuthenticated } = useAuth()

    // Check if city is in favorites
    useEffect(() => {
        if (isAuthenticated && city) {
            checkIfFavorite()
        }
    }, [isAuthenticated, city])

    const checkIfFavorite = async () => {
        try {
            console.log('🔍 Checking if favorite:', city)
            const favorites = await getFavorites()
            const isFav = favorites.includes(city)
            console.log('📋 Is favorite:', isFav)
            setIsFavorite(isFav)
        } catch (error) {
            console.error('Check favorite error:', error)
            setIsFavorite(false)
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
                console.log('🗑️ Removing favorite:', city)
                await removeFavorite(city)
                setIsFavorite(false)
            } else {
                console.log('⭐ Adding favorite:', city)
                await addFavorite(city)
                setIsFavorite(true)
            }
            if (onFavoriteChange) onFavoriteChange()
            // Refresh the favorites list in sidebar
            window.dispatchEvent(new Event('favoritesUpdated'))
        } catch (error) {
            console.error('Toggle favorite error:', error)
            alert(error.response?.data?.message || 'Failed to update favorites')
        } finally {
            setLoading(false)
        }
    }

    // Don't render button if not authenticated
    if (!isAuthenticated) {
        return null
    }

    return (
        <button
            onClick={handleToggleFavorite}
            disabled={loading}
            className={`p-2 rounded-full transition-colors ${
                isFavorite 
                    ? 'text-yellow-500 hover:text-yellow-600' 
                    : 'text-gray-400 hover:text-yellow-500'
            }`}
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
            {loading ? '⏳' : (isFavorite ? '⭐' : '☆')}
        </button>
    )
}

export default FavoriteButton