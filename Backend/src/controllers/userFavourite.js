



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





// 1. Below code is used to create a function to ADD FAVORITE CITY
// Start of Add Favourite City Function
export const addFavoriteCity = async (req, res) => {
    
    try {
        const userId = req.user.id; // Populated by your auth middleware
        const { city } = req.body;

        if (!city) {
            return res.status(httpStatus.BAD_REQUEST).json({
                status: STATUS.FAILED,
                message: 'City name is required'
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(httpStatus.NOT_FOUND).json({
                status: STATUS.FAILED,
                message: 'User not found'
            });
        }

        // Only add if it doesn't already exist in favorites
        if (!user.favorites.includes(city)) {
            user.favorites.push(city);
            await user.save();
        }

        return res.status(httpStatus.OK).json({
            status: STATUS.SUCCESS,
            message: `${city} added to favorites successfully`,
            data: { favorites: user.favorites }
        });

    } catch (error) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            status: STATUS.ERROR,
            message: 'An error occurred while adding favorite city',
            error: error.message
        });
    }
};
// End of Add Favourite City Function

// 2. Below code is used to create a function to GET FAVORITE CITY
// Start of Get Favourite City Function
export const getFavoriteCity = async (req, res) => {

    // Below code is the tryCatch Block
    try {
        const userId = req.user.id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(httpStatus.NOT_FOUND).json({
                status: STATUS.FAILED,
                message: 'User not found'
            });
        }

        if (!user.favorites) {
            return res.status(httpStatus.NOT_FOUND).json({
                status: STATUS.FAILED,
                message: 'User Favourite City is not found'
            });
        }
       
        return res.status(httpStatus.OK).json({
            status: STATUS.SUCCESS,
            message: `below are your favorites ${city} `,
            data: { favorites: user.favorites }
        });


        
    } catch (error) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            status: STATUS.ERROR,
            message: 'An error occurred while retriving your favorite city',
            error: error.message
        });
    }

}
// End of Get Favourite City Function


// 3. Below code is used to create a function to REMOVE FAVORITE CITY
// Start of Remove Favourite City Function
export const removeFavoriteCity = async (req, res) => {
    try {
        const userId = req.user.id;
        const { city } = req.body; // or req.params if using /favorites/:city

        const user = await User.findById(userId);
        if (!user) {
            return res.status(httpStatus.NOT_FOUND).json({
                status: STATUS.FAILED,
                message: 'User not found'
            });
        }

        // Filter out the city
        user.favorites = user.favorites.filter(fav => fav.toLowerCase() !== city.toLowerCase());
        await user.save();

        return res.status(httpStatus.OK).json({
            status: STATUS.SUCCESS,
            message: `${city} removed from favorites`,
            data: { favorites: user.favorites }
        });

    } catch (error) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            status: STATUS.ERROR,
            message: 'An error occurred while removing favorite city',
            error: error.message
        });
    }
};
// End of Remove Favourite City Function


// 4. Below code is used to create a function to ADD TO SEARCH HISTORY
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



// 5. Below code is used to create a function to GET SEARCH HISTORY
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



// 6. Below code is used to create a function to REMOVE SEARCH HISTORY
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
    addFavoriteCity,
    getFavoriteCity,
    removeFavoriteCity
}