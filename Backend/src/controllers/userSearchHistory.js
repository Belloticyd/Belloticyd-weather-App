

// Import necessary modules and libraries
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import httpStatus from 'http-status-codes';

const STATUS = {
    SUCCESS: 'success',
    ERROR: 'error',
    FAILED: 'failed'
}



// 1. GET SEARCH HISTORY
export const getSearchHistory = async (req, res) => {
  try {
        console.log('📜 GET /api/history - User ID:', req.userId)
            
        const user = await User.findById(req.userId)
        
        if (!user) {
            console.log('❌ User not found')
            return res.status(httpStatus.NOT_FOUND).json({
                status: STATUS.ERROR,
                message: 'User not found'
            })
        }
        
        const history = user.searchHistory || []
        console.log('✅ Found', history.length, 'history items')
        
        res.json({
            status: 'success',
            data: history
        })
    } catch (error) {
        console.error('❌ Get history error:', error)
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            status: STATUS.ERROR,
            message: 'Failed to get history',
            error: error.message
        })
    }
};



// 2. ADD TO SEARCH HISTORY
export const addToSearchHistory = async (req, res) => {
   try {
        const { city, weatherData } = req.body
        console.log('📝 POST /api/history - User ID:', req.userId, 'City:', city)
        
        if (!city) {
            return res.status(httpStatus.BAD_REQUEST).json({
                status: STATUS.FAILED,
                message: 'City name is required'
            })
        }
        
        const user = await User.findById(req.userId)
        
        if (!user) {
            return res.status(httpStatus.NOT_FOUND).json({
                status: STATUS.FAILED,
                message: 'User not found'
            })
        }
        
        // Initialize if doesn't exist
        if (!user.searchHistory) {
            user.searchHistory = []
        }
        
        // Add to beginning of array (most recent first)
        user.searchHistory.unshift({
            city: city,
            weatherData: weatherData || {},
            date: new Date()
        })
        
        // Keep only last 20
        if (user.searchHistory.length > 20) {
            user.searchHistory = user.searchHistory.slice(0, 20)
        }
        
        await user.save()
        
        console.log('✅ Added to history, total:', user.searchHistory.length)
        
        res.json({
            status: STATUS.SUCCESS,
            message: 'Added to history',
            data: { history: user.searchHistory }
        })
    } catch (error) {
        console.error('❌ POST history error:', error)
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            status: STATUS.ERROR,
            message: 'Failed to add to history',
            error: error.message
        })
    }
};



// 3. REMOVE FROM SEARCH HISTORY
export const removeSearchHistory = async (req, res) => {
     try {
        const { city } = req.params
        const decodedCity = decodeURIComponent(city)
        console.log('🗑️ DELETE /api/history/:city - User:', req.userId, 'City:', decodedCity)
        
       
        const user = await User.findById(req.userId)
        
        if (!user) {
            return res.status(httpStatus.NOT_FOUND).json({
                status: STATUS.ERROR,
                message: 'User not found'
            })
        }
        
        if (!user.searchHistory) {
            user.searchHistory = []
        }
        
        user.searchHistory = user.searchHistory.filter(item => 
            item.city.toLowerCase() !== decodedCity.toLowerCase()
        )
        
        await user.save()
        
        console.log('✅ Removed from history, remaining:', user.searchHistory.length)
        
        res.json({
            status: STATUS.SUCCESS,
            message: `Removed ${decodedCity} from history`,
            data: user.searchHistory 
        })
    } catch (error) {
        console.error('❌ DELETE history error:', error)
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            status: STATUS.FAILED,
            message: 'Failed to remove from history',
            error: error.message
        })
    }
};

// 4. CLEAR ALL SEARCH HISTORY
export const clearSearchHistory = async (req, res) => {
    try {
        console.log('🗑️ DELETE /api/history - User:', req.userId)
        
       
        const user = await User.findById(req.userId)
        
        if (!user) {
            return res.status(httpStatus.NOT_FOUND).json({
                status: STATUS.FAILED,
                message: 'User not found'
            })
        }
        
        user.searchHistory = []
        await user.save()
        
        console.log('✅ All history cleared')
        
        res.json({
            status: STATUS.SUCCESS,
            message: 'All history cleared',
            data:  [] 
        })
    } catch (error) {
        console.error('❌ Clear history error:', error)
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            status: STATUS.FAILED,
            message: 'Failed to clear history',
            error: error.message
        })
    }
};

export default {
    addToSearchHistory,
    getSearchHistory,
    removeSearchHistory,
    clearSearchHistory
};