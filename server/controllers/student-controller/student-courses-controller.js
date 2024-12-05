const StudentCourses = require('../../models/StudentCourses');

const getCoursesByStudentId = async (req, res) => {
    try {
        const { studentId } = req.params;

        const studentBoughtCourses = await StudentCourses.findOne({
            userId: studentId
        })

        res.status(200).json({
            success: true,
            data: studentBoughtCourses.courses
        })
    } catch (error) {
        console.log("Error occur in getCoursesByStudentId :", error);
        res.status(500).json({
            success: false,
            message: 'Error occured when getting data.'
        })
    }
}

module.exports = { getCoursesByStudentId }