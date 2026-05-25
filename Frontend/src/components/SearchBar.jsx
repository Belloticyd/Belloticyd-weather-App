
// Below code is the react libraries to import from react
import React from 'react'
import { useState } from 'react'

const SearchBar = ({ onSearch, isLoading }) => {
    const [city, setCity] = useState("");

    // Below function is used to handle submit
    // Start of handleSubmit function
    const handleSubmit = (e) => {
        e.preventDefault()  // Prevent page refresh

        // only search If city  is not empty condition
        if (city.trim()) {
            
            onSearch(city.trim());
            setCity("")
        }
    }
    // End of handleSubmit function


  return (

    <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex gap-2">
            <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Enter city name (e.g., Nigeria, London, Tokyo, New York)"
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
