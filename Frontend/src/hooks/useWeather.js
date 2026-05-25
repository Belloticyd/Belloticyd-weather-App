  

import { useQuery } from '@tanstack/react-query'
import { 
    getCurrentWeather, 
    getForeCastWeather, 
    formatForecastData
 } from '../service/weatherService.js'


// Custom hook for fetching current weather
export const useCurrentWeather = (city) => {
  return useQuery({
    // Unique key for this query (like an ID)
    queryKey: ['weather', city],
    
    // Function that fetches the data
    queryFn: () => getCurrentWeather(city),
    
    // Only run if city exists and is not empty
    enabled: !!city && city.trim().length > 0,
    
    // Data stays fresh for 5 minutes
    staleTime: 5 * 60 * 1000,
    
    // Cache data for 10 minutes
    gcTime: 10 * 60 * 1000,
    
    // Retry failed requests 2 times
    retry: 2,
    
    // Show error after 10 seconds
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  })
}

// Custom hook for fetching forecast
export const useForecast = (city) => {
  return useQuery({
    queryKey: ['forecast', city],
    queryFn: async () => {
      const data = await getForeCastWeather(city)
      return formatForecastData(data)
    },
    enabled: !!city && city.trim().length > 0,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
  })
}
