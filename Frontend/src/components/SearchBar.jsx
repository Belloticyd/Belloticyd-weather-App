



import { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useAuth } from '../context/AuthContext'

const API_URL = 'http://localhost:8000/api'

function SearchBar({ onSearch, isLoading }) {
    const [city, setCity] = useState('')
    const { isAuthenticated } = useAuth()
    const getToken = () => localStorage.getItem('token')

    const saveToHistory = async (searchCity) => {
        if (!isAuthenticated) return
        
        const token = getToken()
        try {
            await axios.post(`${API_URL}/history`, { 
                city: searchCity, 
                weatherData: {} 
            }, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            window.dispatchEvent(new CustomEvent('historyUpdated'))
            
            // Show success notification
            toast.info(`📜 "${searchCity}" saved to search history`, {
                position: "bottom-center",
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            })
        } catch (error) {
            console.error('Failed to save to history:', error)
            toast.warning(`⚠️ Could not save "${searchCity}" to history`, {
                position: "bottom-center",
                autoClose: 2000,
            })
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (city.trim()) {
            const searchCity = city.trim()
            
            // Call the search function
            onSearch(searchCity)
            
            // Save to history if logged in
            if (isAuthenticated) {
                await saveToHistory(searchCity)
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