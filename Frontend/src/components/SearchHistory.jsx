


import { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-toastify'

const API_URL = 'http://localhost:8000/api'

function SearchHistory({ onSelectCity, isOpen, onClose }) {
    const [history, setHistory] = useState([])
    const [loading, setLoading] = useState(false)
    const { isAuthenticated } = useAuth()

    const getToken = () => localStorage.getItem('token')

    const loadHistory = async () => {
        const token = getToken()
        
        if (!isAuthenticated || !token) {
            console.log('Not authenticated, skipping history load')
            return
        }
        
        setLoading(true)
        console.log('Loading search history...')
        
        try {
            const response = await axios.get(`${API_URL}/history`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            console.log('History API response:', response.data)
            
            const historyData = response.data.data?.history || []
            console.log('History data:', historyData)
            
            setHistory(historyData)
        } catch (error) {
            console.error('Error loading history:', error)
            toast.error('Failed to load search history')
        } finally {
            setLoading(false)
        }
    }

    const handleClearHistory = async () => {
        const token = getToken()
        
        if (window.confirm('Clear all search history?')) {
            try {
                await axios.delete(`${API_URL}/history`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
                await loadHistory()
                toast.success('📜 Search history cleared!')
            } catch (error) {
                console.error('Clear error:', error)
                toast.error('Failed to clear history')
            }
        }
    }

    const handleRemoveOne = async (city, e) => {
        e.stopPropagation()
        const token = getToken()
        
        try {
            await axios.delete(`${API_URL}/history/${encodeURIComponent(city)}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            await loadHistory()
            toast.success(`🗑️ ${city} removed from history`)
        } catch (error) {
            console.error('Remove error:', error)
            toast.error('Failed to remove from history')
        }
    }

    const handleSelectCity = (city) => {
        onSelectCity(city)
        onClose()
    }

    useEffect(() => {
        if (isOpen && isAuthenticated) {
            loadHistory()
        }
    }, [isOpen, isAuthenticated])

    // Listen for history updates
    useEffect(() => {
        const handleHistoryUpdate = () => {
            if (isOpen) {
                loadHistory()
            }
        }
        
        window.addEventListener('historyUpdated', handleHistoryUpdate)
        return () => window.removeEventListener('historyUpdated', handleHistoryUpdate)
    }, [isOpen])

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
                fixed top-0 right-0 h-full w-80 bg-white dark:bg-gray-800 shadow-xl z-50
                transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : 'translate-x-full'}
            `}>
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                            📜 Search History
                        </h2>
                        <div className="flex gap-2">
                            {history.length > 0 && (
                                <button
                                    onClick={handleClearHistory}
                                    className="text-red-500 hover:text-red-700 text-sm"
                                >
                                    Clear All
                                </button>
                            )}
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
                            <p className="text-gray-500 dark:text-gray-400 mt-2">Loading history...</p>
                        </div>
                    ) : history.length === 0 ? (
                        <div className="text-center py-8">
                            <div className="text-4xl mb-2">📜</div>
                            <p className="text-gray-500 dark:text-gray-400">No search history yet</p>
                            <p className="text-sm text-gray-400 mt-2">
                                Search for a city and it will appear here
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {history.map((item, index) => (
                                <div
                                    key={index}
                                    onClick={() => handleSelectCity(item.city)}
                                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 
                                             rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600
                                             transition-colors group"
                                >
                                    <div className="flex-1">
                                        <span className="text-gray-800 dark:text-white font-medium">
                                            📍 {item.city}
                                        </span>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {item.date ? new Date(item.date).toLocaleString() : 'Just now'}
                                        </p>
                                    </div>
                                    <button
                                        onClick={(e) => handleRemoveOne(item.city, e)}
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

export default SearchHistory