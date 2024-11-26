const Faculty = require('../models/Faculty')
const { verifyTokenAndAdmin, verifyTokenAndAuthorization } = require('./verifyToken')
const router = require('express').Router()


// get all faculties
router.get('/', async(req,res)=>{
    try{
        // Fetch all faculty documents from the database
        const faculties =await Faculty.find({})
        res.status(200).json(faculties)
    }
    catch(err){
        res.status(404).json(err)
    }
})


// get single faculty
router.get('/:id', verifyTokenAndAdmin, async(req,res)=>{
    const id=req.params.id // Extract faculty ID from request parameters
    try{
        // Fetch the faculty document with the provided ID
        const faculty =await Faculty.findById(id)
        res.status(200).json(faculty)
    }
    catch(err){
        res.status(404).json(err)
    }
})


// update faculty
router.put('/:id', verifyTokenAndAuthorization, async(req,res)=>{
    const id=req.params.id // Extract faculty ID from request parameters
    try{
        const updatedFaculty =await Faculty.findByIdAndUpdate(id,{$set:req.body},{new:true})
        res.status(200).json(updatedFaculty)
    }
    catch(err){
        res.status(500).json(err)
    }
})


// delete faculty
router.delete('/:id', verifyTokenAndAuthorization, async(req,res)=>{
    const id=req.params.id
    try{
        await Faculty.findByIdAndDelete(id)
        res.status(200).json("Successfully deleted")
    }
    catch(err){
        res.status(500).json(err)
    }
})


// Create faculty
router.post('/', verifyTokenAndAdmin, async(req,res)=>{
    // Create a new Faculty instance with the data from the request body
    const newFaculty=new Faculty(req.body)
    try{
        // Save the new faculty document to the database
        const savedFaculty=await newFaculty.save()
        res.status(200).json(savedFaculty)
    }
    catch(err){
        res.status(500).json(err)
    }
})


module.exports = router