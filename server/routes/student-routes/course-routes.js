const express = require('express')
const { getAllStudentViewCourses, getStudentViewCourseDetails, checkCoursePurchasedInfo } = require('../../controllers/student-controller/course-controller')
const router = express.Router()

router.get("/get", getAllStudentViewCourses)
router.get("/get/details/:id/:studentId", getStudentViewCourseDetails)
router.get("/purchase-info/:id/:studentId", checkCoursePurchasedInfo);

module.exports = router