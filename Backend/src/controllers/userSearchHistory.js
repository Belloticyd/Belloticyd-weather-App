



// Import necessary modules and libraries
import User from '../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import httpStatus from 'http-status-codes';

const STATUS = {
    SUCCESS: 'success',
    ERROR: 'error',
    FAILED: 'failed'
}




// 1. Below code is used to create a function to ADD TO SEARCH HISTORY
// Start of Add to Search History Function
export const addToSearchHistory = async (req, res) => {
    try {
        const userId = req.user.id;
        const { city, weatherData } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(httpStatus.NOT_FOUND).json({
                status: STATUS.FAILED,
                message: 'User not found'
            });
        }

        // Add to the front of the array
        user.searchHistory.unshift({
            city,
            weatherData,
            date: new Date()
        });

        // Keep only the last 20 searches
        if (user.searchHistory.length > 20) {
            user.searchHistory.pop();
        }

        await user.save();

        return res.status(httpStatus.OK).json({
            status: STATUS.SUCCESS,
            message: 'Search history updated',
            data: { searchHistory: user.searchHistory }
        });

    } catch (error) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            status: STATUS.ERROR,
            message: 'An error occurred while saving search history',
            error: error.message
        });
    }
};
// End of Add to Search History Function



// 2. Below code is used to create a function to GET SEARCH HISTORY
// Start of Get to Search History Function
export const getSearchHistory = async (req, res) => {
    try {
        const userId = req.user.id;
        const { city, weatherData } = req.body

        const user = await User.findById(userId);
        if (!user) {
            return res.status(httpStatus.NOT_FOUND).json({
                status: STATUS.FAILED,
                message: 'User not found'
            });
        }
        if (!city) {
            return res.status(httpStatus.NOT_FOUND).json({
                status: STATUS.FAILED,
                message: 'City name required'
            });
           
        }

        
        // Get the last 10 searches using slice
        const limitedHistory = user.searchHistory.slice(0, 10);

        return res.status(httpStatus.OK).json({
            status: STATUS.SUCCESS,
            data: { searchHistory: limitedHistory, weatherData }
        });

    } catch (error) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            status: STATUS.ERROR,
            message: 'An error occurred while fetching search history',
            error: error.message
        });
    }
};



// 3. Below code is used to create a function to REMOVE SEARCH HISTORY
// Start of Remove  Search History Function
export const removeSearchHistory = async (req, res) => {

    // Below code is the tryCatch Block
    try {
        
        const userId = req.user.id;
        const { city } = req.body; // or req.params if using /history /:city

        const user = await User.findById(userId);
        if (!user) {
            return res.status(httpStatus.NOT_FOUND).json({
                status: STATUS.FAILED,
                message: 'User not found'
            });
        }

        // Filter out the city from the search history
        user.searchHistory = user.searchHistory.filter(shistory => shistory.toLowerCase() !== city.toLowerCase());
        await user.save();

        return res.status(httpStatus.OK).json({
            status: STATUS.SUCCESS,
            message: `${city} removed from search history successfully`,
            data: { searchHistory: user.searchHistory }
        });
    } catch (error) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            status: STATUS.ERROR,
            message: 'An error occurred while removing from the  search history',
            error: error.message
        });
    }

}
// End of Remove  Search History Function






export default {
    addToSearchHistory,
    getSearchHistory,
    removeSearchHistory
}