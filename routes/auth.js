const Student = require('../models/Students')
const User = require('../models/User')
const router = require('express').Router()
const CryptoJS = require('crypto-js')
const jwt = require('jsonwebtoken')


// Route for student login - user provides {admNo, dob}
router.post('/student-login', async (req, res) => {
    try{
        //fetching student from db using admNo
        const student = await Student.findOne({admNo: req.body.admNo})
        if(!student) // If no student is found, send an error response
        {
            res.status(401).json("Wrong Admission Number!")
        } 
        else
        {
            const dob = student.dob 
            if(dob !== req.body.dob) // If DOB doesn't match, send an error response
            {
                return res.status(401).json("Wrong DOB!")
            }

            // Generate a JWT token for the student
            const accessToken = jwt.sign(
                {
                    admNo: student.admNo // Payload contains the student's admission number
                },
                process.env.JWT_SEC, // Secret key from environment variables
                {expiresIn: "3d"} // Token expiration time
            )

            // Send the student details along with the access token as the response
            dob === req.body.dob && res.status(200).json({...student._doc, accessToken})
        }
    }
    catch(err){
        res.status(500).json(err)
    }
})


// Route for student login - user provides {username, password}
router.post('/user-login', async (req, res) => {
    try{
        // Fetching the user from the database using the username
        const user = await User.findOne({username: req.body.username})
        if(!user) // If no user is found, send an error response
        {
            res.status(401).json("Wrong Credentials!")
        } 
        else
        {
            // Decrypt the password stored in the database
            const decryptedPass = CryptoJS.AES.decrypt(user.password, process.env.PASS_SEC).toString(CryptoJS.enc.Utf8) 
            if(decryptedPass !== req.body.password) // If decrypted password doesn't match the provided one, send an error response
            {
                return res.status(401).json("Wrong Password!")
            }

            // Generate a JWT token for the user
            const accessToken = jwt.sign(
                {
                    username: user.username // Payload contains the username
                },
                process.env.JWT_SEC,
                {expiresIn: "3d"}
            )

            // Exclude the password from the user details in the response
            const {password, ...others} = user._doc;
            // Send the user details along with the access token as the response
            decryptedPass === req.body.password && res.status(200).json({...others, accessToken})
        }
    }
    catch(err){
        res.status(500).json(err)
    }
})


module.exports = router