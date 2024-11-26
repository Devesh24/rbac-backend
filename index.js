const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = express();
dotenv.config();

const studentRoute = require("./routes/student")
const authRoute = require("./routes/auth")
const userRoute = require("./routes/user")
const facultyRoute = require("./routes/faculty")

const cors=require("cors");
const corsOptions ={
    origin:'*',
    credentials:true,
    optionSuccessStatus:200,
}
app.use(cors(corsOptions))

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("DB Connection Successfull..")
  })
  .catch((err) => {
    console.log(err);
  });


app.use(express.json())
app.use('/api/student', studentRoute)
app.use('/api/auth', authRoute)
app.use('/api/user', userRoute)
app.use('/api/faculty', facultyRoute)


app.listen(process.env.PORT || 5000, () => {
    console.log("Backend server is running..");
})

