


import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useAuth } from '../context/AuthContext'

const API_URL = 'http://localhost:8000/api'

function FavoritesSidebar({ onSelectCity, isOpen, onClose }) {
    const [favorites, setFavorites] = useState([])
    const [loading, setLoading] = useState(false)
    const { isAuthenticated } = useAuth()
    
    const getToken = () => localStorage.getItem('token')

    const loadFavorites = useCallback(() => {
        const token = getToken()
        
        if (!isAuthenticated || !token) {
            setFavorites([])
            setLoading(false)
            return
        }
        
        setLoading(true)
        
        axios.get(`${API_URL}/favorites`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(response => {
            const favs = response.data.data?.favorites || []
            setFavorites(favs)
            setLoading(false)
        })
        .catch(error => {
            console.error('Error loading favorites:', error)
            toast.error('Failed to load favorites', {
                position: "top-right",
                autoClose: 3000,
            })
            setFavorites([])
            setLoading(false)
        })
    }, [isAuthenticated])

    const handleRemove = (city) => {
        const token = getToken()
        
        toast.info(`Removing ${city} from favorites...`, {
            position: "top-right",
            autoClose: 1000,
        })
        
        axios.delete(`${API_URL}/favorites/${encodeURIComponent(city)}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(() => {
            loadFavorites()
            toast.success(`🗑️ ${city} removed from favorites!`, {
                position: "top-right",
                autoClose: 2000,
                icon: "⭐",
            })
        })
        .catch(error => {
            console.error('Remove error:', error)
            toast.error(`❌ Failed to remove ${city}`, {
                position: "top-right",
                autoClose: 3000,
            })
        })
    }

    const handleSelectCity = (city) => {
        onSelectCity(city)
        onClose()
        toast.info(`📍 Loading weather for ${city}`, {
            position: "bottom-center",
            autoClose: 1500,
        })
    }

    useEffect(() => {
        if (isOpen) {
            loadFavorites()
        }
    }, [isOpen, loadFavorites])

    useEffect(() => {
        const handleFavoritesChanged = () => {
            if (isOpen) {
                loadFavorites()
            }
        }
        
        window.addEventListener('favoritesChanged', handleFavoritesChanged)
        return () => window.removeEventListener('favoritesChanged', handleFavoritesChanged)
    }, [isOpen, loadFavorites])

    if (!isAuthenticated) return null

    return (
        <>
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40"
                    onClick={onClose}
                />
            )}
            
            <div className={`
                fixed top-0 left-0 h-full w-80 bg-white dark:bg-gray-800 shadow-xl z-50
                transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                            ⭐ Favorite Cities
                        </h2>
                        <div className="flex gap-2">
                            <button
                                onClick={() => loadFavorites()}
                                className="text-gray-500 hover:text-gray-700 dark:text-gray-400"
                                title="Refresh"
                            >
                                🔄
                            </button>
                            <button
                                onClick={onClose}
                                className="text-gray-500 hover:text-gray-700 dark:text-gray-400"
                            >
                                ✕
                            </button>
                        </div>
                    </div>
                </div>
                
                <div className="p-4 overflow-y-auto h-full pb-20">
                    {loading ? (
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                            <p className="text-gray-500 dark:text-gray-400 mt-2">Loading favorites...</p>
                        </div>
                    ) : favorites.length === 0 ? (
                        <div className="text-center py-8">
                            <div className="text-4xl mb-2">⭐</div>
                            <p className="text-gray-500 dark:text-gray-400">No favorites yet</p>
                            <p className="text-sm text-gray-400 mt-2">
                                Click the star button on any city to add it here
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {favorites.map((city, index) => (
                                <div
                                    key={`${city}-${index}`}
                                    onClick={() => handleSelectCity(city)}
                                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 
                                             rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600
                                             transition-colors group"
                                >
                                    <span className="text-gray-800 dark:text-white font-medium">
                                        📍 {city}
                                    </span>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            handleRemove(city)
                                        }}
                                        className="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default FavoritesSidebar