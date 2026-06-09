

// Below code is used to import the necessaries libraries
import express from 'express'

import { register, login } from "../controllers/userController";

import authMiddleware from '../middleware/auth';

// Below code is the Instance of a Router
const router = express.Router();

// // Helper function to create JWT token
// const generateToken = (userId) => {
//   return jwt.sign({ userId }, process.env.JWT_SECRET, {
//     expiresIn: '7d'
//   })
// }

const STATUS = {
    SUCCESS: 'success',
    ERROR: 'error',
    FAILED: 'failed'
}

//Below code is used to create a  REGISTER ROUTE
router.post('/register', register)

// LOGIN ROUTE

router.post('/login', login)
// END OF LOGIN FUNCTION

// GET USER PROFILE (Protected route)
router.get('/profile', authMiddleware, async (req, res) => {
  try {

    // req.userId comes from authMiddleware
    console.log('📝 Getting profile for user ID:', req.userId)


    // req.userId comes from authMiddleware
    const user = await User.findById(req.userId).select('-password')
    
    if (!user) {
      console.log('❌ User not found for ID:', req.userId)
      return res.status(404).json({ 
        status: STATUS.FAILED,
        message: 'User not found' 
      })
    }

    console.log('✅ Profile found for:', user.email)
    
    // Send response in the format your frontend expects
    res.json({
      status: STATUS.SUCCESS,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          favorites: user.favorites  || [],
          createdAt: user.createdAt
        }
      }
    })
  } catch (error) {
    console.error('Profile error:', error)
    res.status(500).json({ 
      status: STATUS.FAILED,
      message: 'Server error' 
    })
  }
})




export default router
// module.exports = router
