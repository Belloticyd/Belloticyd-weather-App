

// Below code is used to import axios
import axios from "axios"
import { API_URL } from '../config'

// Get API key from environment variables (secret!)
// const API_KEY = import.meta.env.VITE_WEATHER_API_KEY
const API_KEY = import.meta.env.VITE_WEATHER_API_KEY

// Get API URL from environment variables
// const API_URL = 'http://localhost:8000/api'
// const API_URL = 'https://belloticyd-weather-app.onrender.com/api' || import.meta.env.VITE_API_URL
// const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

// Below code is the based URL to the weather web site
const BASE_URL = 'https://api.openweathermap.org/data/2.5'

// Start Create an axios instance with default settings
const weatherAPI = axios.create({
        baseURL: BASE_URL,
    params: {
        appid: API_KEY,
        units: 'metric'  // Use Celsius
    }
})
// End of creating axios instance


// // Function to get current weather
// // // Start of the function to get the current weather
export const getCurrentWeather = async (city) => {

    // Below code is the tryCatch Block
    try {

        const response = await weatherAPI.get('/weather', {
            params: { q: city }
        })
        return response.data

    } catch (error) {

        console.error('Weather API Error:', error.response?.data || error.message)
        throw error
    }

}
// End of the function to get the current weather


// Function to get 5-day forecast
// // // Start of the function to get a 5 days forecast
export const getForeCastWeather = async (city) => {

    try {
        const response = await weatherAPI.get('/forecast', {
            params: { q: city }
        })
        return response.data
    } catch (error) {
        console.error('Forecast API Error:', error.response?.data || error.message)
        throw error
    }

}
// End of the function to get a 5 days forecast


// Helper function to format forecast data (API returns 40 items, we want daily)
export const formatForecastData = (forecastData) => {
  if (!forecastData || !forecastData.list) return []
  
  // Filter to get one reading per day (every 8th item = 24 hours)
  return forecastData.list.filter((_, index) => index % 8 === 0).slice(0, 5)
}