

import { useState } from 'react'
import { useCurrentWeather, useForecast } from './hooks/useWeather'
import SearchBar from './components/SearchBar'
import WeatherCard from './components/WeatherCard'
import ForecastCard from './components/ForecastCard'
import DarkModeToggle from './components/DarkModeToggle'

function App() {

  // State for the searched city
  const [city, setCity] = useState('')

  // Use our custom hooks to fetch data
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


  // Handle search submission
  const handleSearch = (searchCity) => {
    setCity(searchCity)
  }

  // Combine loading states
  const isLoading = weatherLoading || forecastLoading
  
  // Combine errors
  const error = weatherError || forecastError

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">

      {/* Below is the Dark and Light Toggle Mode */}
      <DarkModeToggle />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-2">
            🌤️ My Weather App
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Get current weather status and 5-day forecast for any city
          </p>
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

      <p className="text-center">&; Created and Developed by Belloticyd</p>
    </div>
  )
}

export default App
