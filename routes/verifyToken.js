const jwt = require('jsonwebtoken')
const User = require('../models/User')

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.token
    if(authHeader)
    {
        const token = authHeader.split(" ")[1]
        jwt.verify(token, process.env.JWT_SEC, (err, user)=>{
            if(err) res.status(403).json("Token is not valid!")
            else
            {
                req.user = user 
                next()
            }
        })
    }
    else
    {
        return res.status(401).json("You are not authenticated!")
    }
}

const verifyTokenAndAuthorization = async (req, res, next) => {
    verifyToken(req, res, async ()=>{
        const thisUser = await User.findOne({username: req.user.username})
        if(thisUser.permission === "Yes")
        {
            next()
        }
        else res.status(403).json("You are not allowed to do this");
    })
}


const verifyTokenAndAdmin = async (req, res, next) => {
    verifyToken(req, res, async ()=>{
        const thisUser = await User.findOne({username: req.user.username})
        if(thisUser.type === "Admin")
        {
            next()
        }
        else
        {
            console.log(111);
            res.status(403).json("You are not allowed to do this")
        } 
    })
}

module.exports = { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin }