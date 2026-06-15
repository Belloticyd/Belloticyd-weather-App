

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

// REGISTER NEW USER
export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body

        // // console.log('📝 Registration attempt for:', email)

        // Validate input
        if (!name || !email || !password) {
            return res.status(400).json({
                status: STATUS.FAILED,
                message: 'Please provide name, email and password'
            })
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).json({
                status: STATUS.FAILED,
                message: 'User already exists'
            });
        }

        // Password hashing
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        // Create new user - use a different variable name like 'newUser'
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            favorites: [],
            searchHistory: []
        })

        await newUser.save()
        // // console.log('✅ User created with ID:', newUser._id)

        // Generate JWT token
        const token = jwt.sign(
            { userId: newUser._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        )

        res.status(201).json({
            status: STATUS.SUCCESS,
            message: 'New user registered successfully',
            data: {
                token: token,
                user: {
                    id: newUser._id,
                    name: newUser.name,
                    email: newUser.email,
                    favorites: newUser.favorites || [],
                    createdAt: newUser.createdAt
                }
            }
        })

    } catch (error) {
        console.error('❌ Registration error:', error)
        res.status(500).json({
            status: STATUS.ERROR,
            message: 'An error occurred while registering new user',
            error: error.message
        })
    }
}
// END OF REGISTER NEW USER FUNCTION


// START OF LOGIN FUNCTION
export const login = async (req, res) => {
    try {
        const { email, password } = req.body

        // // console.log('📝 Login attempt for:', email)

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                status: STATUS.FAILED,
                message: 'Please provide email and password'
            })
        }

        // Use 'foundUser' instead of just 'user' to avoid conflicts
        const foundUser = await User.findOne({ email })
        if (!foundUser) {
            return res.status(401).json({
                status: STATUS.FAILED,
                message: 'Invalid email or password'
            })
        }

        const isPasswordMatch = await bcrypt.compare(password, foundUser.password)
        if (!isPasswordMatch) {
            return res.status(401).json({
                status: STATUS.FAILED,
                message: 'Invalid email or password'
            })
        }

        const token = jwt.sign(
            { userId: foundUser._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        )

        // // console.log('✅ Login successful for:', email)

        res.status(200).json({
            status: STATUS.SUCCESS,
            message: 'User logged in successfully',
            data: {
                token: token,
                user: {
                    id: foundUser._id,
                    name: foundUser.name,
                    email: foundUser.email,
                    favorites: foundUser.favorites || [],
                    searchHistory: foundUser.searchHistory || [],
                    createdAt: foundUser.createdAt
                }
            }
        })

    } catch (error) {
        console.error('❌ Login error:', error)
        res.status(500).json({
            status: STATUS.ERROR,
            message: 'An error occurred while logging in',
            error: error.message
        })
    }
}
// END OF LOGIN FUNCTION


// GET USER PROFILE - FIXED VERSION
// GET USER PROFILE
export const getProfile = async (req, res) => {
    try {
        // // console.log('📝 Getting profile for user ID:', req.userId)
        
        if (!req.userId) {
            return res.status(401).json({
                status: 'error',
                message: 'Unauthorized'
            })
        }
        
        const profileUser = await User.findById(req.userId).select('-password')
        
        if (!profileUser) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found'
            })
        }
        
        // // console.log('✅ Profile found for:', profileUser.email)
        
        res.json({
            status: 'success',
            data: {
                user: {
                    id: profileUser._id,
                    name: profileUser.name,
                    email: profileUser.email,
                    favorites: profileUser.favorites || [],
                    searchHistory: profileUser.searchHistory || [],
                    createdAt: profileUser.createdAt
                }
            }
        })
    } catch (error) {
        console.error('❌ Profile error:', error)
        res.status(500).json({
            status: 'error',
            message: 'Server error',
            error: error.message
        })
    }
}

// Export all functions
export default {
    register,
    login,
    getProfile
}


