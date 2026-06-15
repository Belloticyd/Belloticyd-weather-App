


function HourlyForecast({ hourlyData }) {
    if (!hourlyData || hourlyData.length === 0) return null

    const next12Hours = hourlyData.slice(0, 12)

    return (
        <div className="mt-8">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                12-Hour Forecast
            </h3>
            <div className="overflow-x-auto">
                <div className="flex gap-4 pb-4 min-w-max">
                    {next12Hours.map((hour, index) => (
                        <div key={index} className="text-center bg-gray-100 dark:bg-gray-800 rounded-lg p-3 w-24">
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {new Date(hour.dt * 1000).toLocaleTimeString([], { hour: '2-digit' })}
                            </p>
                            <div className="text-2xl my-2">
                                {hour.weather[0].main === 'Clear' && '☀️'}
                                {hour.weather[0].main === 'Clouds' && '☁️'}
                                {hour.weather[0].main === 'Rain' && '🌧️'}
                            </div>
                            <p className="text-lg font-bold text-gray-900 dark:text-white">
                                {Math.round(hour.main.temp)}°C
                            </p>
                            <p className="text-xs text-gray-500 capitalize">
                                {hour.weather[0].description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default HourlyForecast