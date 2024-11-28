const Course = require("../../models/Course");

const getAllStudentViewCourses = async (req, res) => {
    try {
        const { category = [], level = [], primaryLanguage = [], sortBy = "price-lowtohigh" } = req.query;

        let filters = {};
        if (category.length) {
            filters.category = { $in: category.split(',') }
        }
        if (level.length) {
            filters.level = { $in: level.split(',') }
        }
        if (primaryLanguage.length) {
            filters.primaryLanguage = { $in: primaryLanguage.split(',') }
        }

        let sort = {};
        switch (sortBy) {
            case 'price-lowtohigh':
                sort.pricing = 1
                break;

            case 'price-hightolow':
                sort.pricing = -1
                break;

            case 'title-atoz':
                sort.title = 1
                break;

            case 'title-ztoa':
                sort.title = -1
                break;

            default:
                sort.pricing = 1
                break;
        }

        // const courseDetails = await Course.find({}) //get All
        const courseDetails = await Course.find(filters).sort(sort);

        // if (courseDetails.length === 0) {
        //     return res.status(404).json({
        //         success: false,
        //         message: "No course found.",
        //         data: []
        //     })
        // }

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