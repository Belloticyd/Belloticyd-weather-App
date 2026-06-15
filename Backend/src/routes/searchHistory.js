


// Below code is used to import the necessaries libraries
import express from 'express'


import { 
  addToSearchHistory,
  getSearchHistory,
  removeSearchHistory,
  clearSearchHistory
} from '../controllers/userSearchHistory.js'

import User from '../models/User.js'
import authMiddleware from '../middleware/auth.js';

// Below code is the Instance of a Router
const searchHistoryRouter = express.Router();

// All routes require authentication
searchHistoryRouter.use(authMiddleware)




// History Routes
searchHistoryRouter.post('/', authMiddleware,   addToSearchHistory);
searchHistoryRouter.get('/', authMiddleware,   getSearchHistory);
searchHistoryRouter.delete("/:city", authMiddleware,   removeSearchHistory)
searchHistoryRouter.delete("/", authMiddleware,   clearSearchHistory )





export default searchHistoryRouter