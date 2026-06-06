


import express from 'express'
import { 
    getFavorites,
    addFavorite,
    removeFavorite

 } from '../controllers/favoritesController.js'
import authMiddleware from '../middleware/auth.js'

const router = express.Router()

// All routes require authentication
router.use(authMiddleware)

// Routes
router.get('/', getFavorites)           // Get all favorites
router.post('/', addFavorite)           // Add a favorite
router.delete('/:city', removeFavorite) // Remove a favorite

export default router