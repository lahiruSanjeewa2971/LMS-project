const CourseProgress = require('../../models/CourseProgress')
const Course = require('../../models/Course')
const StudentCourses = require('../../models/StudentCourses')


// get current course progress
const getCurrentCourseProgress = async (req, res) => {
    try {

    } catch (error) {
        console.log('Error in getCurrentCourseProgress :', error)
        res.status(500).json({
            success: false,
            message: "Something went wrong."
        })
    }
}

// mark current viewed lecture as viewed
const markCurrentLectureAsViewed = async (req, res) => {
    try {

    } catch (error) {
        console.log('Error in markCurrentLectureAsViewed :', error)
        res.status(500).json({
            success: false,
            message: "Something went wrong."
        })
    }
}

// reset course progress
const resetCurrentCourseProgress = async (req, res) => {
    try {

    } catch (error) {
        console.log('Error in resetCurrentCourseProgress :', error)
        res.status(500).json({
            success: false,
            message: "Something went wrong."
        })
    }
}

module.exports = { markCurrentLectureAsViewed, resetCurrentCourseProgress, getCurrentCourseProgress }
