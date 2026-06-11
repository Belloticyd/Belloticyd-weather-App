


import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

const API_URL = 'http://localhost:8000/api'

// Fetch favorites function
const fetchFavorites = async (token) => {
    console.log('🔵 fetchFavorites called with token:', !!token)
    
    if (!token) {
        console.log('No token, returning empty array')
        return []
    }
    
    try {
        const response = await axios.get(`${API_URL}/favorites`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        console.log('📦 fetchFavorites response:', response.data)
        return response.data.data?.favorites || []
    } catch (error) {
        console.error('❌ fetchFavorites error:', error)
        throw error
    }
}

// Add favorite function
const addFavoriteAPI = async ({ token, city }) => {
    console.log('➕ addFavoriteAPI called for:', city)
    const response = await axios.post(`${API_URL}/favorites`, { city }, {
        headers: { 'Authorization': `Bearer ${token}` }
    })
    return response.data.data?.favorites || []
}

// Remove favorite function
const removeFavoriteAPI = async ({ token, city }) => {
    console.log('➖ removeFavoriteAPI called for:', city)
    const response = await axios.delete(`${API_URL}/favorites/${encodeURIComponent(city)}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    })
    return response.data.data?.favorites || []
}

// Custom hook for favorites
export const useFavorites = () => {
    const { token, isAuthenticated } = useAuth()
    const queryClient = useQueryClient()

    console.log('🎣 useFavorites hook - isAuthenticated:', isAuthenticated, 'hasToken:', !!token)

    // Query to get favorites
    const query = useQuery({
        queryKey: ['favorites'],
        queryFn: () => fetchFavorites(token),
        enabled: !!token && isAuthenticated,
        staleTime: 5 * 60 * 1000,
    })

    console.log('📊 useFavorites query state:', { 
        isLoading: query.isLoading, 
        isError: query.isError,
        dataLength: query.data?.length,
        error: query.error
    })

    // Mutation to add favorite
    const addMutation = useMutation({
        mutationFn: addFavoriteAPI,
        onSuccess: () => {
            console.log('✅ Add favorite success, invalidating queries')
            queryClient.invalidateQueries({ queryKey: ['favorites'] })
            window.dispatchEvent(new Event('favoritesUpdated'))
        },
        onError: (error) => {
            console.error('❌ Add favorite error:', error)
        }
    })

    // Mutation to remove favorite
    const removeMutation = useMutation({
        mutationFn: removeFavoriteAPI,
        onSuccess: () => {
            console.log('✅ Remove favorite success, invalidating queries')
            queryClient.invalidateQueries({ queryKey: ['favorites'] })
            window.dispatchEvent(new Event('favoritesUpdated'))
        },
        onError: (error) => {
            console.error('❌ Remove favorite error:', error)
        }
    })

    return {
        favorites: query.data || [],
        isLoading: query.isLoading,
        error: query.error,
        refetch: query.refetch,
        addFavorite: (city) => addMutation.mutateAsync({ token, city }),
        removeFavorite: (city) => removeMutation.mutateAsync({ token, city }),
        isAdding: addMutation.isPending,
        isRemoving: removeMutation.isPending
    }
}