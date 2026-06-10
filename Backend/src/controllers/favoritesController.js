




import User from '../models/User.js'
import httpStatus from 'http-status-codes'

const STATUS = {
    SUCCESS: 'success',
    ERROR: 'error',
    FAILED: 'failed'
}

// Get user's favorite cities
export const getFavorites = async (req, res) => {
    try {
        console.log('📝 Getting favorites for user ID:', req.userId)
        
        // Make sure req.userId exists
        if (!req.userId) {
            console.log('❌ No userId in request')
            return res.status(httpStatus.UNAUTHORIZED).json({
                status: STATUS.ERROR,
                message: 'Unauthorized - no user ID'
            })
        }
        
        const user = await User.findById(req.userId)
        
        if (!user) {
            console.log('❌ User not found for ID:', req.userId)
            return res.status(httpStatus.NOT_FOUND).json({
                status: STATUS.ERROR,
                message: 'User not found'
            })
        }
        
        console.log('✅ Found user:', user.email)
        console.log('📋 Favorites:', user.favorites || [])
        
        res.json({
            status: STATUS.SUCCESS,
            data: {
                favorites: user.favorites || []
            }
        })
    } catch (error) {
        console.error('❌ Get favorites error:', error)
        res.status(500).json({
            status: STATUS.ERROR,
            message: 'Failed to fetch favorites',
            error: error.message
        })
    }
}

// Add city to favorites
export const addFavorite = async (req, res) => {
    try {
        const { city } = req.body
        
        console.log('📝 Adding favorite:', city, 'for user:', req.userId)
        
        if (!city) {
            return res.status(400).json({
                status: STATUS.FAILED,
                message: 'City name is required'
            })
        }
        
        if (!req.userId) {
            return res.status(httpStatus.UNAUTHORIZED).json({
                status: STATUS.ERROR,
                message: 'Unauthorized - no user ID'
            })
        }
        
        const user = await User.findById(req.userId)
        
        if (!user) {
            return res.status(httpStatus.NOT_FOUND).json({
                status: STATUS.ERROR,
                message: 'User not found'
            })
        }
        
        // Initialize favorites array if it doesn't exist
        if (!user.favorites) {
            user.favorites = []
        }
        
        // Check if city already in favorites
        if (user.favorites.includes(city)) {
            return res.status(httpStatus.BAD_REQUEST).json({
                status: STATUS.FAILED,
                message: `${city} is already in your favorites`
            })
        }
        
        // Add to favorites
        user.favorites.push(city)
        await user.save()
        
        console.log('✅ Favorite added:', city)
        console.log('📋 Updated favorites:', user.favorites)
        
        res.json({
            status: STATUS.SUCCESS,
            message: `${city} added to favorites`,
            data: {
                favorites: user.favorites
            }
        })
    } catch (error) {
        console.error('❌ Add favorite error:', error)
        res.status(500).json({
            status: STATUS.ERROR,
            message: 'Failed to add favorite',
            error: error.message
        })
    }
}

// Remove city from favorites
export const removeFavorite = async (req, res) => {
    try {
        const { city } = req.params
        
        console.log('📝 Removing favorite:', city, 'for user:', req.userId)
        
        if (!req.userId) {
            return res.status(httpStatus.UNAUTHORIZED).json({
                status: STATUS.ERROR,
                message: 'Unauthorized - no user ID'
            })
        }
        
        const user = await User.findById(req.userId)
        
        if (!user) {
            return res.status(httpStatus.NOT_FOUND).json({
                status: STATUS.ERROR,
                message: 'User not found'
            })
        }
        
        // Initialize favorites array if it doesn't exist
        if (!user.favorites) {
            user.favorites = []
        }
        
        // Remove from favorites array
        user.favorites = user.favorites.filter(fav => fav !== city)
        await user.save()
        
        console.log('✅ Favorite removed:', city)
        console.log('📋 Updated favorites:', user.favorites)
        
        res.json({
            status: STATUS.SUCCESS,
            message: `${city} removed from favorites`,
            data: {
                favorites: user.favorites
            }
        })
    } catch (error) {
        console.error('❌ Remove favorite error:', error)
        res.status(500).json({
            status: STATUS.ERROR,
            message: 'Failed to remove favorite',
            error: error.message
        })
    }
}

export default {
    getFavorites,
    addFavorite,
    removeFavorite
}