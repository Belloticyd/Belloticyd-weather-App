

// Below code is used to import the necessaries libraries
import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"


import authRoute from "./routes/auth.routes"
import favoriteRoutes from "./routes/favoritesRoutes"
import searchHistoryRouter from "./routes/searchHistory"


// below code is used to Load environment variables
dotenv.config()

// below code is used to  Create Express app
const app = express()

// Below code is used to set up cors and body-parser middleware for the express app
// Cors Start Here
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'], // Allow all origins (you can specify specific origins if needed)
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow specific HTTP methods
    credentials: true, // if you want to send cookies
    allowedHeaders: ['Content-Type', 'Authorization'] // Allow specific headers
}))                    // Allow frontend to connect
// Cors End Here

// Middleware to parse JSON bodies in requests
app.use(express.json())            // Parse JSON requests

// Below code is used to check if mongoDB_URL connected or not
if (!process.env.MONGODB_URI) {
  console.error("❌ Error: MONGODB_URI is undefined! Check your .env file.");
} else {
  mongoose.connect(process.env.MONGODB_URI);
}

// Connect to MongoDB using Mongoose
// Below code is used to connect to the MongoDB database using the connection string from the environment variables. It also sets up event listeners for successful connection and error handling
// Start of MongoDB connection code
mongoose.connect(process.env.MONGODB_URI)
.then(() => {
  console.log("Connected to MongoDB successfully!");
  app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
  });
})
.catch((err) => console.log(err));
// End of MongoDB connection code

// Define a route handler for the default home page
app.get('/', (req, res) => {
  res.send('Welcome to the Weather APP backend Service API!');
});


// Below code is used to test the Basic route
app.get("/test", (req, res) =>{
    res.json({message: 'API is up and working Perfectly!!'})
})


// API test route (with /api prefix for frontend)
app.get("/api/test", (req, res) => {
    res.json({ message: 'Backend is working!' })
})


// Below code is the main route for user-related operations. It uses the userRoutes module to handle all routes that start with /api/users. 
// This allows for better organization and separation of concerns in the codebase.
// Below code is used to Import all the routes (we'll create these)
// const authRoutes = require('./routes/auth.routes')
app.use('/api/auth', authRoute)
app.use("/api/favorites", favoriteRoutes)
app.use('/api/history', searchHistoryRouter)



// export the app for use in other modules (like testing)
export default app;
