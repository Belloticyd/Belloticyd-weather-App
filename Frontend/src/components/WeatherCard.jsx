


import React from 'react'

import FavoriteButton from './FavoriteButton'

const WeatherCard = ({ weatherData }) => {

    // If no data yet, show loading placeholder
        if (!weatherData) {
        return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
            <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded w-full mb-4"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
        </div>
        )
    }

    // Get the weather condition for emoji
    const getWeatherEmoji = (condition) => {
        const main = condition?.main?.toLowerCase() || ''
        if (main.includes('clear')) return '☀️'
        if (main.includes('cloud')) return '☁️'
        if (main.includes('rain')) return '🌧️'
        if (main.includes('snow')) return '❄️'
        if (main.includes('thunder')) return '⛈️'
        if (main.includes('drizzle')) return '🌦️'
        if (main.includes('mist') || main.includes('fog')) return '🌫️'
        return '🌡️'
    }
    // End of the weatherData


  return (
        <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
            {/* City Name and Date */}
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h2 className="text-3xl font-bold">{weatherData.name}</h2>
                    <p className="text-blue-100 mt-1">
                        {new Date().toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                        })}
                    </p>
                </div>
                <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-2">
                        <h2 className="text-3xl font-bold">{weatherData.name}</h2>
                        <FavoriteButton city={weatherData.name} />
                    </div>
                    {/* rest of the header */}
                </div>
                <div className="text-right">
                    <div className="flex items-center gap-2">
                        <span className="text-6xl font-bold">
                        {Math.round(weatherData.main.temp)}°C
                        </span>
                        <span className="text-4xl">
                        {getWeatherEmoji(weatherData.weather[0])}
                        </span>
                    </div>
                    <p className="text-blue-100 capitalize mt-1">
                        {weatherData.weather[0].description}
                    </p>
                </div>
            </div>

            {/* Weather Details Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="bg-white/20 rounded-lg p-3 text-center">
                <p className="text-sm text-blue-100">Feels Like</p>
                <p className="text-xl font-semibold">{Math.round(weatherData.main.feels_like)}°C</p>
                </div>
                <div className="bg-white/20 rounded-lg p-3 text-center">
                <p className="text-sm text-blue-100">Humidity</p>
                <p className="text-xl font-semibold">{weatherData.main.humidity}%</p>
                </div>
                <div className="bg-white/20 rounded-lg p-3 text-center">
                <p className="text-sm text-blue-100">Wind Speed</p>
                <p className="text-xl font-semibold">{weatherData.wind.speed} m/s</p>
                </div>
                <div className="bg-white/20 rounded-lg p-3 text-center">
                <p className="text-sm text-blue-100">Pressure</p>
                <p className="text-xl font-semibold">{weatherData.main.pressure} hPa</p>
                </div>
            </div>

            {/* Sunrise/Sunset */}
            <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="bg-white/20 rounded-lg p-3">
                <p className="text-sm text-blue-100">🌅 Sunrise</p>
                <p className="text-lg font-semibold">
                    {new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                    })}
                </p>
                </div>
                <div className="bg-white/20 rounded-lg p-3">
                <p className="text-sm text-blue-100">🌇 Sunset</p>
                <p className="text-lg font-semibold">
                    {new Date(weatherData.sys.sunset * 1000).toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                    })}
                </p>
                </div>
            </div>
            
        </div>
    )
}

export default WeatherCard
