require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI

const authRoutes = require('./routes/auth-routes')
const mediaRoutes = require('./routes/instructor-routes/media-routes')
const instructorCourseRoutes = require('./routes/instructor-routes/course-routes')
const studentViewCourseRoutes = require('./routes/student-routes/course-routes')

app.use(cors({
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: ["content-Type", "Authorization"],
}))

app.use(express.json());

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to MongoDB"))
    .catch((e) => console.log("Error connecting to MongoDB:", e));

// routes config
app.use("/auth", authRoutes);
app.use("/media", mediaRoutes);
app.use("/instructor/course", instructorCourseRoutes);
app.use("/student/course", studentViewCourseRoutes);

app.use((err, req, res, next) => {
    console.log(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong.'
    })
})

app.listen(PORT, () => {
    console.log(`Server connected to : ${PORT}`)
})