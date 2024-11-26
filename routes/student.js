const jwt = require('jsonwebtoken')
const Student = require('../models/Students')
const { verifyTokenAndAuthorization, verifyTokenAndAdmin } = require('./verifyToken')
const router = require('express').Router()
 

// get student by token
router.post('/token/verify', async (req, res) => {
    const {token} = req.body
    try{
        // Verify the JWT token and extract student data
        const student = jwt.verify(token, process.env.JWT_SEC) 
        const studAdm = student.admNo // Extract admission number from token payload
        const data = await Student.findOne({admNo: studAdm}) // Find the student in the database
        res.status(200).json(data)
    }
    catch(err){
        res.status(500).json(err)
    }
})


// create a student
router.post('/createstudent', verifyTokenAndAdmin, async (req, res) => {
    
    const newStudent = new Student(req.body)

    try{
        // Check if a student with the same admission number already exists
        const oldAdmNo = await Student.findOne({admNo: req.body.admNo})
        if(oldAdmNo)
        {
            res.status(400).json("Student already exists!!")
        }
        else
        {
            const savedStudent = await newStudent.save()
            res.status(200).json(savedStudent)
        }
    }
    catch(err){
        res.status(500).json(err)
    }
})


// get a student by id
router.get('/getstudentbyid/:id', verifyTokenAndAuthorization, async (req, res) => {
    try{
        const student = await Student.findById(req.params.id)
        res.status(200).json(student)
    }
    catch(err){
        res.status(500).json(err)
    }
})


// get student by name, admission no and class
router.get('/searchstudent', verifyTokenAndAuthorization, async (req, res) => {
    try {
        // Create case-insensitive regex for name and class queries
        const searchname = RegExp(req.query.name, "i")
        const searchclass = RegExp(req.query.class, "i")
        const admNo = req.query.admNo

        var students
        // sort the students in ascending order
        if (req.query.name != '') students = await Student.find({ name: searchname }).sort({name:1})
        else if (req.query.class != '') students = await Student.find({ class: searchclass }).sort({name:1})
        else students = await Student.find({ admNo: admNo })

        res.status(200).json(students)
    }
    catch (err) {
        res.status(500).json(err)
    }
})



// count number of students for chart
router.get('/countstudents', verifyTokenAndAuthorization, async (req, res) => {
    try{
        const totalStudents = await Student.countDocuments() // Total number of students
        const currStudents = await Student.countDocuments() // Current active students (those excluding tc)
        const result = await Student.aggregate([
            {
                $unwind: "$class" // Unwind the "class" array to get a separate document for each class entry
            },
            {
                $group: {
                _id: "$class", // Group by the "class" field
                count: { $sum: 1 } // Count the number of students in each class and store it in the "count" field
                }
            },
            {
                $project: {
                _id: 0, // Exclude the default "_id" field from the output
                class: "$_id", // Rename the "_id" field to "class"
                count: 1 // Include the "count" field in the output
                }
            }
        ])

        const classIndexes = {"Nursery":0, "LKG":1, "UKG":2, "1st": 3, "2nd": 4, "3rd": 5, "4th": 6, "5th": 7, "6th": 8, "7th": 9, "8th": 10, "9th":11, "10th":12, "11th":13, "12th":14}
        const count = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0] // Initialize count array for all classes

        result.map((i)=>{
            count[classIndexes[i.class]] = i.count // Map class count to the corresponding index
        })
        res.status(200).json({totalStudents, currStudents, count})
    }
    catch(err){
        res.status(500).json(err)
    }
})




// update a student by id
router.put('/updatestudentbyid/:id', verifyTokenAndAuthorization, async (req, res) => {
    try{
        // Update student details by ID
        const updatedStudent = await Student.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, {new: true})
        res.status(200).json(updatedStudent)
    }
    catch(err){
        res.status(500).json(err)
    }
})


// delete a student
router.delete('/deletestudent/:id', verifyTokenAndAdmin, async (req, res) => {
    try{
        await Student.findByIdAndDelete(req.params.id)
        res.status(200).json("Student Deleted")
    }
    catch(err){
        res.status(500).json(err)
    }
})

module.exports = router