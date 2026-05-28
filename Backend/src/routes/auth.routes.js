

// Below code is used to import the necessaries libraries
import express from 'express'

import { register, login } from "../controllers/userController";

// Below code is the Instance of a Router
const router = express.Router();

// Helper function to create JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  })
}

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

// GET USER PROFILE (protected - we'll add middleware later)
router.get('/profile', async (req, res) => {
  try {
    // We'll add authentication middleware here
    res.json({ message: 'This is a protected route', 
        user: req.user 
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
})



export default router
// module.exports = router
