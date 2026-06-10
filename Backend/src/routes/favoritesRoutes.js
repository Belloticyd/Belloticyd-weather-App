
// Below code is used to import the necessaries libraries
import express from 'express'



import { 
  addFavoriteCity,
  getFavoriteCity,
  removeFavoriteCity,
} from "../controllers/userFavourite.js"

import { 
    getFavorites,
    addFavorite,
    removeFavorite

 } from '../controllers/favoritesController.js'

import authMiddleware from '../middleware/auth';

// Below code is the Instance of a Router
const favoriteRouter = express.Router();


// Favorite Routes
favoriteRouter.post('/favorites', authMiddleware, addFavoriteCity);
favoriteRouter.get("/favorites", authMiddleware, getFavoriteCity)
favoriteRouter.delete('/favorites/:city', authMiddleware, removeFavoriteCity);

// Routes
favoriteRouter.get('/', authMiddleware,  getFavorites)           // Get all favorites
favoriteRouter.post('/', authMiddleware,  addFavorite)           // Add a favorite
favoriteRouter.delete('/:city', authMiddleware,  removeFavorite) // Remove a favorite


export default favoriteRouter