
// Below code is used to import the necessaries libraries
import express from 'express'



import { 
  addFavoriteCity,
  getFavoriteCity,
  removeFavoriteCity,
} from "../controllers/userFavourite.js"

import authMiddleware from '../middleware/auth';

// Below code is the Instance of a Router
const favoriteRouter = express.Router();


// Favorite Routes
favoriteRouter.post('/favorites', authMiddleware, addFavoriteCity);
favoriteRouter.get("/favorites", authMiddleware, getFavoriteCity)
favoriteRouter.delete('/favorites/:city', authMiddleware, removeFavoriteCity);


export default favoriteRouter