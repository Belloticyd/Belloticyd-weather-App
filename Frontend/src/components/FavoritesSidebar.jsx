import { useState, useEffect } from 'react'
import { getFavorites, removeFavorite } from '../services/favoritesService'
import { useAuth } from '../context/AuthContext'

function FavoritesSidebar({ onSelectCity, isOpen, onClose }) {
    const [favorites, setFavorites] = useState([])
    const [loading, setLoading] = useState(true)
    const { isAuthenticated, token } = useAuth()

    // Load favorites when component mounts or auth changes
    useEffect(() => {
        if (isAuthenticated && token) {
            loadFavorites()
        }
    }, [isAuthenticated, token])

    const loadFavorites = async () => {
        try {
            setLoading(true)
            console.log('📋 Loading favorites...')
            const favs = await getFavorites()
            console.log('✅ Favorites loaded:', favs)
            setFavorites(favs || [])
        } catch (error) {
            console.error('Failed to load favorites:', error)
            setFavorites([])
        } finally {
            setLoading(false)
        }
    }

    const handleRemove = async (city, e) => {
        e.stopPropagation()
        try {
            await removeFavorite(city)
            // Update local state immediately
            setFavorites(favorites.filter(fav => fav !== city))
            // Reload to ensure sync with backend
            await loadFavorites()
        } catch (error) {
            console.error('Failed to remove favorite:', error)
            alert(error.response?.data?.message || 'Failed to remove favorite')
        }
    }

    const handleSelectCity = (city) => {
        console.log('📍 Selected favorite city:', city)
        onSelectCity(city)
        if (window.innerWidth < 768) {
            onClose()
        }
    }

    // Don't render if not authenticated
    if (!isAuthenticated) {
        return null
    }

    return (
        <>
            {/* Overlay for mobile */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={onClose}
                />
            )}
            
            {/* Sidebar */}
            <div className={`
                fixed top-0 left-0 h-full w-80 bg-white dark:bg-gray-800 shadow-xl z-50
                transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                md:translate-x-0 md:static md:w-80 md:shadow-md
            `}>
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                            ⭐ Favorite Cities
                        </h2>
                        <button
                            onClick={onClose}
                            className="md:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400"
                        >
                            ✕
                        </button>
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
                            <p className="text-gray-500 dark:text-gray-400">
                                No favorites yet
                            </p>
                            <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                                Click the star button on any city to add it here
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {favorites.map((city) => (
                                <div
                                    key={city}
                                    onClick={() => handleSelectCity(city)}
                                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 
                                             rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600
                                             transition-colors group"
                                >
                                    <span className="text-gray-800 dark:text-white font-medium">
                                        📍 {city}
                                    </span>
                                    <button
                                        onClick={(e) => handleRemove(city, e)}
                                        className="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                                        aria-label={`Remove ${city}`}
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