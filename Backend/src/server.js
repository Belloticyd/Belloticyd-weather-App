

// Below code is used to import the necessaries libraries
import dotenv from "dotenv";

// below code is used to Load environment variables
dotenv.config()

// Below code is used to import the app.js files
import app from "./app";


// Set the port for the server to listen on, defaulting to 5000 if not specified in environment variables
const PORT = process.env.PORT || 5000;


// Start the server and listen on the specified port
app.listen(PORT, () =>{
    console.log(`Weather Backend Server is running on port ${PORT}`)
})