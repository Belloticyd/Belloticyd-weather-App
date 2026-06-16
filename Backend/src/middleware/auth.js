



// Below code is used to import the necessary modules and libraries for the user controller. It includes the User model
//  for interacting with the users collection in the database, bcryptjs for hashing passwords, jsonwebtoken for creating
//  and verifying JWT tokens, and http-status-codes for standardized HTTP status codes.
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import httpStatus from 'http-status-codes';





const STATUS = {
    SUCCESS: 'success',
    ERROR: 'error',
    FAILED: 'failed'
}


// Below code is used to create Authentication middleware that will be used to protect routes that require 
// authentication. 
// Start of Authentication middleware function
const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(httpStatus.UNAUTHORIZED).json({
                status: 'error',
                message: 'No token provided'
            })
        }

        const token = authHeader.split(' ')[1]
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        
        req.userId = decoded.userId
        
        next()
    } catch (error) {
        console.error('Auth middleware error:', error.message)
        
        if (error.name === 'JsonWebTokenError') {
            return res.status(httpStatus.UNAUTHORIZED).json({
                status: 'error',
                message: 'Invalid token'
            })
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(httpStatus.UNAUTHORIZED).json({
                status: 'error',
                message: 'Token expired'
            })
        }
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            status: 'error',
            message: 'Server error'
        })
    }
}



export default authMiddleware;
// module.exports = authMiddleware