const Course = require('../models/Course');

const addNewCourse = async (req, res) => {
    try {
        const courseData = req.body;
        const newlyCreatedCourse = new Course(courseData);
        const saveCourse = await newlyCreatedCourse.save();

        if (saveCourse) {
            res.status(201).json({
                success: true,
                message: 'Course created successfully.',
                data: saveCourse
            })
        }

    } catch (error) {
        console.log('Error in addNewCourse :', error);
        res.status(500).json({
            success: false,
            message: 'Some error occured.'
        })
    }
}

const getAllCourses = async (req, res) => {
    try {
        const coursesList = await Course.find();

        res.status(200).json({
            success: true,
            data: coursesList
        })
    } catch (error) {
        console.log('Error in getAllCourses :', error);
        res.status(500).json({
            success: false,
            message: 'Some error occured.'
        })
    }
}

const getCourseDetailsById = async (req, res) => {
    try {
        const { id } = req.params;
        const courseDetails = await Course.findById(id);

        if (!courseDetails) {
            return res.status(404).json({
                success: false,
                message: "Course not found."
            })
        }

        res.status(200).json({
            success: true,
            data: courseDetails
        })
    } catch (error) {
        console.log('Error in getCourseDetailsById :', error);
        res.status(500).json({
            success: false,
            message: 'Some error occured.'
        })
    }
}

const updateCourseById = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedCourseData = req.body;

        const updatedCourse = await Course.findByIdAndUpdate(id, updatedCourseData, { new: true })

        if (!updatedCourse) {
            return res.status(404).json({
                success: false,
                message: 'Course not found.'
            })
        }

        res.status(200).json({
            success: true,
            message: 'Course updated successfull.',
            data: updatedCourse
        })
    } catch (error) {
        console.log('Error in updateCourseById :', error);
        res.status(500).json({
            success: false,
            message: 'Some error occured.'
        })
    }
}

module.exports = { addNewCourse, getAllCourses, getCourseDetailsById, updateCourseById }