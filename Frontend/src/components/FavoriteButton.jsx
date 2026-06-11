


import { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useAuth } from '../context/AuthContext'

const API_URL = 'http://localhost:8000/api'

function FavoriteButton({ city }) {
    const [isFavorite, setIsFavorite] = useState(false)
    const [loading, setLoading] = useState(false)
    const { isAuthenticated } = useAuth()
    
    const getToken = () => localStorage.getItem('token')

    const checkFavorite = () => {
        const token = getToken()
        if (!isAuthenticated || !token || !city) return
        
        axios.get(`${API_URL}/favorites`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(response => {
            const favorites = response.data.data?.favorites || []
            setIsFavorite(favorites.includes(city))
        })
        .catch(error => console.error('Check error:', error))
    }

    const toggleFavorite = () => {
        const token = getToken()
        
        if (!isAuthenticated) {
            toast.warning('Please login to save favorites', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            })
            return
        }

        setLoading(true)
        
        if (isFavorite) {
            // Remove favorite
            axios.delete(`${API_URL}/favorites/${encodeURIComponent(city)}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            .then(() => {
                setIsFavorite(false)
                setLoading(false)
                window.dispatchEvent(new CustomEvent('favoritesChanged'))
                
                // Success toast for removal
                toast.success(`🗑️ ${city} removed from favorites!`, {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    icon: "⭐",
                })
            })
            .catch(error => {
                console.error('Remove error:', error)
                setLoading(false)
                toast.error(`❌ Failed to remove ${city} from favorites`, {
                    position: "top-right",
                    autoClose: 3000,
                })
            })
        } else {
            // Add favorite
            axios.post(`${API_URL}/favorites`, { city }, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            .then(() => {
                setIsFavorite(true)
                setLoading(false)
                window.dispatchEvent(new CustomEvent('favoritesChanged'))
                
                // Success toast for addition
                toast.success(`⭐ ${city} added to favorites!`, {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    icon: "⭐",
                })
            })
            .catch(error => {
                console.error('Add error:', error)
                setLoading(false)
                toast.error(`❌ Failed to add ${city} to favorites`, {
                    position: "top-right",
                    autoClose: 3000,
                })
            })
        }
    }

    useEffect(() => {
        checkFavorite()
    }, [isAuthenticated, city])

    useEffect(() => {
        window.addEventListener('favoritesChanged', checkFavorite)
        return () => window.removeEventListener('favoritesChanged', checkFavorite)
    }, [])

    if (!isAuthenticated) return null

    return (
        <button
            onClick={toggleFavorite}
            disabled={loading}
            className={`p-2 rounded-full transition-colors ${
                isFavorite 
                    ? 'text-yellow-500 hover:text-yellow-600' 
                    : 'text-gray-400 hover:text-yellow-500'
            }`}
            style={{ fontSize: '24px', cursor: 'pointer' }}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
            {loading ? '⏳' : (isFavorite ? '⭐' : '☆')}
        </button>
    )
}

export default FavoriteButton