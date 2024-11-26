const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = express();
dotenv.config(); // Loading environment variables from a .env file

// Importing route modules
const studentRoute = require("./routes/student")
const authRoute = require("./routes/auth")
const userRoute = require("./routes/user")
const facultyRoute = require("./routes/faculty")


// Importing CORS middleware to handle cross-origin requests
const cors=require("cors");
const corsOptions ={
    origin:'*', // Allow requests from any origin
    credentials:true, // Allow credentials to be sent in requests
    optionSuccessStatus:200, // Response status for successful OPTIONS requests
}
app.use(cors(corsOptions)) // Applying the CORS middleware with the specified options


// Connecting to the MongoDB database using Mongoose
mongoose
  .connect(process.env.MONGO_URL) // Database connection URL is stored in the environment variable
  .then(() => {
    console.log("DB Connection Successfull..")
  })
  .catch((err) => {
    console.log(err);
  });


// Middleware to parse JSON data in incoming requests
app.use(express.json())

// Setting up API routes
app.use('/api/student', studentRoute)
app.use('/api/auth', authRoute)
app.use('/api/user', userRoute)
app.use('/api/faculty', facultyRoute)


// Starting the server
app.listen(process.env.PORT || 5000, () => {
    console.log("Backend server is running..");
})

