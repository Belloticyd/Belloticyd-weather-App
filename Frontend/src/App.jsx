



import { useState, useEffect } from 'react'
import { ToastContainer } from 'react-toastify'


import { useAuth } from './context/AuthContext'
import { useCurrentWeather, useForecast } from './hooks/useWeather'
import SearchBar from './components/SearchBar'
import WeatherCard from './components/WeatherCard'
import ForecastCard from './components/ForecastCard'
import DarkModeToggle from './components/DarkModeToggle'
import AuthModal from './components/AuthModal'
import FavoritesSidebar from './components/FavoritesSidebar'
import SearchHistory from './components/SearchHistory'

function App() {
  const { user, logout, isAuthenticated } = useAuth()
  const [city, setCity] = useState('')
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showSidebar, setShowSidebar] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [refreshFavorites, setRefreshFavorites] = useState(0)
  
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

  // Listen for favorites updates
  useEffect(() => {
    const handleFavoritesUpdate = () => {
      setRefreshFavorites(prev => prev + 1)
    }
    
    window.addEventListener('favoritesUpdated', handleFavoritesUpdate)
    
    return () => {
      window.removeEventListener('favoritesUpdated', handleFavoritesUpdate)
    }
  }, [])

  const handleSearch = (searchCity) => {
    setCity(searchCity)
  }

  const handleSelectFavorite = (favoriteCity) => {
    setCity(favoriteCity)
    if (window.innerWidth < 768) {
      setShowSidebar(false)
    }
  }

  const handleSelectHistory = (historyCity) => {
    setCity(historyCity)
    if (window.innerWidth < 768) {
      setShowHistory(false)
    }
  }

  const isLoading = weatherLoading || forecastLoading
  const error = weatherError || forecastError

  return (

    <>
      <div className="...">
        <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
        />
        {/* Rest of your app */}
      </div>
      
      
      <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
        {/* Sidebars */}
        <FavoritesSidebar 
          isOpen={showSidebar}
          onClose={() => setShowSidebar(false)}
          onSelectCity={handleSelectFavorite}
          refreshTrigger={refreshFavorites}
        />
        
        <SearchHistory 
          isOpen={showHistory}
          onClose={() => setShowHistory(false)}
          onSelectCity={handleSelectHistory}
        />
        
        {/* Top Bar - Responsive Layout */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 p-4">
          {/* Left side - Toggle Buttons */}
          <div className="flex items-center gap-2">
                    
            {isAuthenticated && (
              <>
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 
                            hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  title="Search History"
                >
                  📜
                </button>
                <button
                  onClick={() => setShowSidebar(!showSidebar)}
                  className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 
                            hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  title="Favorite Cities"
                >
                  ⭐
                </button>
              </>
            )}

            <DarkModeToggle />
          </div>
          
          {/* Right side - User Menu */}
          <div className="flex items-center gap-3 mr-35">
            {isAuthenticated && user ? (
              <>
                <span className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                  👤 {user.name}
                </span>
                <button
                  onClick={() => {
                    logout()
                    setCity('')
                  }}
                  className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
              >
                Login / Register
              </button>
            )}
          </div>
        </div>
        
        {/* Rest of your App content */}
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
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
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

    </>
  )
}

export default App