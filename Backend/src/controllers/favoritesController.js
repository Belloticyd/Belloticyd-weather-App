


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

        console.log('📝 Getting favorites for user:', req.userId)

        const user = await User.findById(req.userId)
        
        res.json({
            status: STATUS.SUCCESS,
            data: {
                favorites: user.favorites || []
            }
        })
    } catch (error) {
        console.error('Get favorites error:', error)
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            status: STATUS.ERROR,
            message: 'Failed to fetch favorites'
        })
    }
}

// Add city to favorites
export const addFavorite = async (req, res) => {

    try {
        const { city } = req.body

        console.log('📝 Adding favorite:', city, 'for user:', req.userId)
        
        if (!city) {
            return res.status(httpStatus.BAD_REQUEST).json({
                status: STATUS.FAILED,
                message: 'City name is required'
            })
        }
        
        const user = await User.findById(req.userId)
        
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
        
        res.json({
            status: STATUS.SUCCESS,
            message: `${city} added to favorites`,
            data: {
                favorites: user.favorites
            }
        })
    } catch (error) {
        console.error('Add favorite error:', error)
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            status: STATUS.ERROR,
            message: 'Failed to add favorite'
        })
    }
}

// Remove city from favorites
export const removeFavorite = async (req, res) => {
    try {
        const { city } = req.params

        console.log('📝 Removing favorite:', city, 'for user:', req.userId)
        console.log('📝 User ID:', req.userId)
        
        const user = await User.findById(req.userId)
        
        // Remove from favorites array
        user.favorites = user.favorites.filter(fav => fav !== city)
        await user.save()
        
        res.json({
            status: STATUS.SUCCESS,
            message: `${city} removed from favorites`,
            data: {
                favorites: user.favorites
            }
        })
    } catch (error) {
        console.error('Remove favorite error:', error)
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            status: STATUS.ERROR,
            message: 'Failed to remove favorite'
        })
    }
}

export default {
    getFavorites,
    addFavorite,
    removeFavorite
}