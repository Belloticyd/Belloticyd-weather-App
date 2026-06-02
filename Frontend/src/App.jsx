

import { useState } from 'react'


import  { useAuth }  from './context/AuthContext'
import { useCurrentWeather, useForecast } from './hooks/useWeather'
import SearchBar from './components/SearchBar'
import WeatherCard from './components/WeatherCard'
import ForecastCard from './components/ForecastCard'
import DarkModeToggle from './components/DarkModeToggle'
import AuthModal from './components/AuthModal'

function App() {
  const { user, logout, isAuthenticated } = useAuth()
  const [city, setCity] = useState('')
  const [showAuthModal, setShowAuthModal] = useState(false)
  
  const { 
    data: weatherData,
    isLoading: weatherLoading,
    error: weatherError,
    refetch: refetchWeather
  } = useCurrentWeather(city)
  
  const { 
    data: forecastData,
    isLoading: forecastLoading,
    error: forecastError
  } = useForecast(city)

  const handleSearch = (searchCity) => {
    setCity(searchCity)
  }

  const isLoading = weatherLoading || forecastLoading
  const error = weatherError || forecastError

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <div className="flex flex-col justify-between md:flex-row lg:flex-row items-center p-4">
        <DarkModeToggle />
      
        {/* // In App.jsx, replace the user menu section (around line 30-50) with: */}

        {/* User Menu - FIXED POSITION */}
        {/* User Menu */}
        <div className="">
          {isAuthenticated && user ? (
            <div className="flex items-center gap-3">
              <span className="text-gray-700 dark:text-gray-300">
                👤 {user.name}
              </span>
              <button
                onClick={() => {
                  logout()
                  setCity('') // Clear searched city on logout
                }}
                className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowAuthModal(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Login / Register
            </button>
          )}
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-2">
            🌤️ Weather App
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Get current weather and 5-day forecast for any city
          </p>
          {isAuthenticated && (
            <p className="text-sm text-green-600 dark:text-green-400 mt-2">
              ✓ Logged in as {user?.email}
            </p>
          )}
        </div>

        {/* Search Bar */}
        <SearchBar onSearch={handleSearch} isLoading={isLoading} />

        {/* Error Display */}
        {error && (
          <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg mb-6">
            <p className="font-medium">Error fetching weather data</p>
            <p className="text-sm">
              {error.response?.data?.message || error.message || 'Please try again'}
            </p>
            <button 
              onClick={() => refetchWeather()}
              className="mt-2 text-sm underline hover:no-underline"
            >
              Try again
            </button>
          </div>
        )}

        {/* Weather Display */}
        {weatherData && <WeatherCard weatherData={weatherData} />}
        
        {/* Forecast Display */}
        {forecastData && forecastData.length > 0 && (
          <ForecastCard forecast={forecastData} />
        )}

        {/* Loading State */}
        {isLoading && !weatherData && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <p className="text-gray-600 dark:text-gray-400 mt-4">Fetching weather data...</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !weatherData && !error && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Search for a city
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              Enter a city name above to see current weather conditions
            </p>
          </div>
        )}
      </div>
      
      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </div>
  )
}

export default App