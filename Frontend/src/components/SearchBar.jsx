


import { useState } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-toastify'

const API_URL = 'http://localhost:8000/api'

function SearchBar({ onSearch, isLoading }) {
    const [city, setCity] = useState('')
    const { isAuthenticated, token } = useAuth()

    const saveToHistory = async (searchCity) => {
        if (!isAuthenticated) return
        
        try {
            await axios.post(`${API_URL}/history`, { 
                city: searchCity, 
                weatherData: {} 
            }, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            // Dispatch event to update history sidebar
            window.dispatchEvent(new CustomEvent('historyUpdated'))
        } catch (error) {
            console.error('Failed to save to history:', error)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (city.trim()) {
            const searchCity = city.trim()
            onSearch(searchCity)
            
            // Save to history
            await saveToHistory(searchCity)
            
            // Show toast notification
            if (isAuthenticated) {
                toast.info(`📜 "${searchCity}" saved to history`, {
                    position: "bottom-center",
                    autoClose: 1500,
                })
            }
            
            setCity('')
        }
    }

    return (
        <form onSubmit={handleSubmit} className="mb-6">
            <div className="flex gap-2">
                <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Enter city name (e.g., London, Tokyo, New York)"
                    className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 
                               bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                               focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isLoading}
                />
                <button
                    type="submit"
                    disabled={isLoading || !city.trim()}
                    className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 
                               disabled:opacity-50 disabled:cursor-not-allowed transition-colors
                               font-medium"
                >
                    {isLoading ? 'Searching...' : 'Search'}
                </button>
            </div>
        </form>
    )
}

export default SearchBar