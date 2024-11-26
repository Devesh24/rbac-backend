const mongoose = require('mongoose')


const StudentSchema = new mongoose.Schema(
    {
        name: {type: String, required: true},
        mName: {type: String, required: true},
        fName: {type: String, required: true},
        address: {type: String, required: true},
        dob: {type: String, required: true},
        doa: {type: String, required: true},
        phNo: {type: String, required: true},
        photo: {type: String, required:true},
        class: {type: String, required: true},
        rollNo: {type: Number, required:true},
        admNo: {type: String, required: true, unique: true},
        category: {type: String, required: true},
        gender: {type: String, required: true},
    },
    {timestamps: true}
)

module.exports = mongoose.model("Student", StudentSchema)