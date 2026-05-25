

import React from 'react'

const ForecastCard = ({ forecast }) => {

    // Below code is used to test if the forecast is greater than 0
    if (!forecast || forecast.length === 0) {
        return null
    }

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

  return (
        <div className="mt-8 bg-gray-100 dark:bg-gray-800">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                5-Day Forecast
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {forecast.map((day, index) => (
                <div 
                    key={index} 
                    className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 text-center hover:scale-105 transition-transform duration-200"
                >
                    <p className="font-medium text-gray-700 dark:text-gray-300">
                     {new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' })}
                    </p>
                    <div className="text-3xl my-2">
                     {getWeatherEmoji(day.weather[0])}
                    </div>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">
                     {Math.round(day.main.temp)}°C
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                        {day.weather[0].description.split(' ').slice(0, 2).join(' ')}
                    </p>
                </div>
                ))}
            </div>
        </div>
    )
}

export default ForecastCard
