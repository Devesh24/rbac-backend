const jwt = require('jsonwebtoken')
const User = require('../models/User')


// Middleware to verify if the token is valid
// token is passed in headers in the form "Bearer <token>"
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.token // Retrieving the token from the request headers
    if(authHeader)
    {
        const token = authHeader.split(" ")[1] // Extracting the actual token from the header
        jwt.verify(token, process.env.JWT_SEC, (err, user)=>{
            if(err) res.status(403).json("Token is not valid!")  // Return error if token verification fails
            else
            {
                req.user = user  // Store the verified user in the request object
                next()  // Call the next middleware or route handler
            }
        })
    }
    else // Return error if token is missing
    {
        return res.status(401).json("You are not authenticated!") 
    }
}


// Middleware to verify token and check if user has permissions
const verifyTokenAndAuthorization = async (req, res, next) => {
    verifyToken(req, res, async ()=>{
        // Fetch the user from the database using the username from the verified token
        const thisUser = await User.findOne({username: req.user.username})
        if(thisUser.permission === "Yes") // Check if the user has permission
        {
            next() // Proceed to the next middleware or route handler
        }
        else res.status(403).json("You are not allowed to do this"); // Return error if user lacks permission
    })
}


// Middleware to verify token and check for admin privileges
const verifyTokenAndAdmin = async (req, res, next) => {
    verifyToken(req, res, async ()=>{
        // Fetch the user from the database using the username from the verified token
        const thisUser = await User.findOne({username: req.user.username})
        if(thisUser.type === "Admin")  // Check if the user has an Admin type
        {
            next() // Proceed to the next middleware or route handler
        }
        else
        {
            res.status(403).json("You are not allowed to do this") // Return error if user is not an admin
        } 
    })
}

module.exports = { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin }