const jwt = require('jsonwebtoken')
const User = require('../models/User')
const { verifyTokenAndAuthorization, verifyTokenAndAdmin } = require('./verifyToken')
const router = require('express').Router()
const CryptoJS = require('crypto-js')



// get user by token
router.post('/token/verify', verifyTokenAndAuthorization, async (req, res) => {
    const {token} = req.body
    try{
        // Decode and verify the JWT token
        const user = jwt.verify(token, process.env.JWT_SEC)
        const username = user.username // Extract username from token payload
        const data = await User.findOne({username: username}) // Find the user in the database
        res.status(200).json(data)
    }
    catch(err){
        res.status(500).json(err)
    }
})



//create user
router.post('/register', verifyTokenAndAdmin, async (req, res) => {
    const newUser = new User({
        username: req.body.username,
        password: CryptoJS.AES.encrypt(req.body.password , process.env.PASS_SEC).toString(), // Encrypt the password
        type: req.body.type // Set the user type (e.g., admin, faculty, etc)
    })

    try{
        // Check if the username already exists
        const oldUsername = await User.findOne({username: req.body.username})
        if(oldUsername)
        {
            res.status(400).json("Username already exists!!")
        }
        else
        {
            const savedUser = await newUser.save()
            res.status(200).json(savedUser)
        }
    }
    catch(err){
        res.status(500).json(err)
    }
})



//change type - update
router.put('/updateuser/:id', verifyTokenAndAdmin, async (req, res) => {
    try{
        // Encrypt the new password before updating
        const encrypted = {...req.body, password: CryptoJS.AES.encrypt(req.body.password , process.env.PASS_SEC).toString()}
        // Update the user in the database and return the updated document
        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set: encrypted
        }, {new: true})
        res.status(200).json(updatedUser)
    }
    catch(err){
        res.status(500).json(err)
    }
})




//get all users 
router.get('/getusers', verifyTokenAndAdmin, async (req, res) => {
    try{
        const users = await User.find()
        const usersWithDecryptedPasswords = [];
        // Decrypt passwords for each user
        for(const user of users)
        {
            const decPass = CryptoJS.AES.decrypt(user.password, process.env.PASS_SEC).toString(CryptoJS.enc.Utf8);
            const {password, ...others} = user._doc // Exclude encrypted password
            usersWithDecryptedPasswords.push({...others, password: decPass}) // Add decrypted password
        }
        res.status(200).json(usersWithDecryptedPasswords)
    }
    catch(err){
        res.status(500).json(err)
    }
})



//delete user
router.delete('/deleteuser/:id', verifyTokenAndAdmin, async (req, res) => {
    try{
        await User.findByIdAndDelete(req.params.id)
        res.status(200).json("User Deleted")
    }
    catch(err){
        res.status(500).json(err)
    }
})



module.exports = router