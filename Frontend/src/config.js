


// This file determines which backend to use
// Production: Use your deployed backend
// Development: Use localhost

// ✅ PRODUCTION URL - CHANGE THIS TO YOUR ACTUAL BACKEND
const PRODUCTION_API_URL = 'https://belloticyd-weather-app.onrender.com/api'

// DEVELOPMENT URL
const DEVELOPMENT_API_URL = 'http://localhost:8000/api'

// Determine which URL to use
const isProduction = import.meta.env.PROD || import.meta.env.MODE === 'production'

export const API_URL = isProduction ? PRODUCTION_API_URL : DEVELOPMENT_API_URL

// For debugging - log which URL is being used
console.log(`🔧 Using API URL: ${API_URL} (${isProduction ? 'production' : 'development'})`)

// Weather API key
export const WEATHER_API_KEY = import.meta.env.VITE_WEATHER_API_KEY