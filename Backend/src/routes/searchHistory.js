


// Below code is used to import the necessaries libraries
import express from 'express'


import { 
  addToSearchHistory,
  getSearchHistory,
  removeSearchHistory,
} from "../controllers/userSearchHistory.js"

import authMiddleware from '../middleware/auth';

// Below code is the Instance of a Router
const searchHistoryRouter = express.Router();




// History Routes
searchHistoryRouter.post('/history', authMiddleware, addToSearchHistory);
searchHistoryRouter.get('/history', authMiddleware, getSearchHistory);
searchHistoryRouter.delete("/history/:city", authMiddleware, removeSearchHistory)





export default searchHistoryRouter