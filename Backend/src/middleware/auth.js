


// Below code is used to import the necessary modules and libraries for the user controller. It includes the User model
//  for interacting with the users collection in the database, bcryptjs for hashing passwords, jsonwebtoken for creating
//  and verifying JWT tokens, and http-status-codes for standardized HTTP status codes.
import User from '../models/User';
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
export const authMiddleware = async (req, res, next) => {

    try {
        // Get token from Authorization header
        const authHeader = req.headers.authorization
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(httpStatus.UNAUTHORIZED).json({ 
                status: STATUS.FAILED,
                message: 'Unauthorized User: Invalid or missing token'
            })
        }

        // Extract token (remove "Bearer " prefix)
        const token = authHeader.split(' ')[1]

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        
        // Add user info to request
        req.userId = decoded.userId
        
        next()
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(httpStatus.GATEWAY_TIMEOUT).json({ 
                status: STATUS.FAILED,
                message: 'Unauthorized: Invalid Users token'
            })
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(httpStatus.GATEWAY_TIMEOUT).json({ 
                status: STATUS.FAILED,
                message: 'Unauthorized: Invalid Users token'
            })
        }
        res.status(500).json({ 
            
            status: STATUS.FAILED,
            message: 'Server Down: server error'
         })
    }
}



export default authMiddleware;
// module.exports = authMiddleware