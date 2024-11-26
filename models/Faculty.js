const mongoose=require('mongoose')
const facultySchema=new mongoose.Schema(
    {
        facultyName:{
            type:String,
            required:true
        },
        facultyEducation:{
            type:String,
            required:true
        },
        facultyExperience:{
            type:Number,
            required:true
        },
        facultyDesignation:{ 
            type:String,
            required:true
        },
        facultyImg:{
            type:String,
            required:true
        },
        facultyPhone:{
            type:String,
            required:true
        }
    },
    {timestamps:true}
);

const Faculty= mongoose.model('Faculty',facultySchema);

module.exports=Faculty
