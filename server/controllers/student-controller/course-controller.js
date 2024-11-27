const Course = require("../../models/Course");

const getAllStudentViewCourses = async (req, res) => {
    try {
        const courseDetails = await Course.find({})

        if (courseDetails.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No course found.",
                data: []
            })
        }

        res.status(200).json({
            success: true,
            data: courseDetails
        })

    } catch (error) {
        console.log("Error in getAllStudentViewCourses :", error);
        res.status(500).json({
            success: false,
            message: "Some error occured."
        })
    }
}

const getStudentViewCourseDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const courseDetails = await Course.findById(id);

        if (!courseDetails) {
            return res.status(404).json({
                success: false,
                message: "Course not found.",
                data: null
            })
        }

        res.status(200).json({
            success: true,
            data: courseDetails
        })
    } catch (error) {
        console.log("Error in getStudentViewCourseDetails :", error);
        res.status(500).json({
            success: false,
            message: "Some error occured."
        })
    }
}

module.exports = { getAllStudentViewCourses, getStudentViewCourseDetails }