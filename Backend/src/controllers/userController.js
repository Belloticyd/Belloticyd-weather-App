

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

// START OF REGISTER NEW USER FUNCTION
export const register =  async (req, res) => {

    // Start of tryCatch Block
    try {
        const { name, email, password } = req.body

        console.log('📝 Registration attempt for:', email)

        // Check if user already exists
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).json({
                status: STATUS.FAILED,
                message: 'User already exists'
            });
        }

        // Password hashing using bcryptjs
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        // ✅ STEP 1: Create a new user instance FIRST
        const user = new User({
            name,
            email,
            password: hashedPassword
        })

        // ✅ STEP 2: Save the new user to the database
        await user.save()
        console.log('✅ User created with ID:', user._id)

        // ✅ STEP 3: NOW generate JWT token (user exists!)
        const token = jwt.sign(
            { userId: user._id },  // ← Now user._id exists!
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        )

        // ✅ STEP 4: Respond with success
        res.status(201).json({
            status: STATUS.SUCCESS,
            message: 'New user registered successfully',
            data: {
                token: token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    createdAt: user.createdAt
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
    // Start of tryCatch Block

}
// END OF REGISTER NEW USER FUNCTION


// START OF LOGIN FUNCTION
export const login = async (req, res) => {

    // Start of try catch block for error handling
    try {
        const { email, password } = req.body

        
        // Check if the user exists in the database
        const user = await User.findOne({ email })
        if (!user) {
             return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                status: STATUS.FAILED, 
                message: 'Invalid email or password' 
            })
        }
        // End of user existence check


        // Check password
        // Compare the provided password with the stored hashed password
        const isPasswordMatch = await bcrypt.compare(password, user.password)

        // If the password is invalid, respond with an error message
        if (!isPasswordMatch) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                status: STATUS.FAILED, 
                message: 'Invalid  Password' 
            })
        }
        // End of user password check

        // If the password is valid, generate a JWT token for authentication
        const token = jwt.sign(
            {userId: user._id || user.id || user.userId,},
            process.env.JWT_SECRET, // Secret key for signing the token from .ENV files
            { expiresIn: '7d' } // Token expiration time (e.g., 7 day)
        )

        // Respond with a success message and the generated token
        res.status(httpStatus.OK).json({
            status: STATUS.SUCCESS,
            message: 'User logged in successfully',
            data: {
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
               
                }

            }
        })


    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            status: STATUS.ERROR,
            message: 'An error occurred while logging in',
            error: error.message
        })
    }
}
// END OF LOGIN FUNCTION





export default {
    register,
    login
}