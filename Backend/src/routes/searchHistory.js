


// Below code is used to import the necessaries libraries
import express from 'express'


import { 
  addToSearchHistory, 
  getSearchHistory, 
  removeSearchHistory,
  clearSearchHistory 
} from '../controllers/userSearchHistory.js'

import User from '../models/User.js'
import authMiddleware from '../middleware/auth';

// Below code is the Instance of a Router
const searchHistoryRouter = express.Router();

// All routes require authentication
searchHistoryRouter.use(authMiddleware)




// History Routes
searchHistoryRouter.post('/',  addToSearchHistory);
searchHistoryRouter.get('/',  getSearchHistory);
searchHistoryRouter.delete("/:city",  removeSearchHistory)
searchHistoryRouter.delete("/",  clearSearchHistory )





export default searchHistoryRouter