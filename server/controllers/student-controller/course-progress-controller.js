const CourseProgress = require('../../models/CourseProgress')
const Course = require('../../models/Course')
const StudentCourses = require('../../models/StudentCourses')


// get current course progress
const getCurrentCourseProgress = async (req, res) => {
    try {
        const { userId, courseId } = req.params;

        const studentPurchasedCourses = await StudentCourses.findOne({
            userId
        })

        const isCurrentCoursePurchasedByCurrentStudent = studentPurchasedCourses?.courses?.findIndex(item => item.courseId === courseId) > -1;

        if (!isCurrentCoursePurchasedByCurrentStudent) {
            return res.status(200).json({
                success: true,
                data: {
                    isPurchased: false,
                },
                message: "You need to purchase this course to access it."
            })
        }

        const currentUserCourseProgress = await CourseProgress.findOne({ userId, courseId });
        // console.log(currentUserCourseProgress)

        // course purchased, but haven't watched any yet.
        if (!currentUserCourseProgress || currentUserCourseProgress?.lectureProgress.length === 0) {
            const course = await Course.findById(courseId);
            if (!course) {
                return res.status(404).json({
                    success: false,
                    message: "Course not found."
                })
            }

            return res.status(200).json({
                success: true,
                message: "No progress found, you can start watching the course.",
                data: {
                    courseDetails: course,
                    progress: [],
                    isPurchased: true,
                    // completed: true
                }
            })
        }

        // course purchased, and started watching.
        const courseDetails = await Course.findById(courseId);

        return res.status(200).json({
            success: true,
            data: {
                courseDetails,
                progress: currentUserCourseProgress?.lectureProgress,
                completed: currentUserCourseProgress?.completed,
                completedData: currentUserCourseProgress?.completionDate,
                isPurchased: true
            }
        })
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
        const { userId, courseId, lectureId } = req.body;

        let progress = await CourseProgress.findOne({ userId, courseId });

        if (!progress) {
            progress = new CourseProgress({
                userId,
                courseId,
                lectureProgress: [{
                    lectureId,
                    viewed: true,
                    dateViewed: new Date()
                }]
            })
            await progress.save()
        } else {
            const lectureProgress = progress.lectureProgress.find(item => item.lectureId === lectureId);
            if (lectureProgress) {
                lectureProgress.viewed = true;
                lectureProgress.dateViewed = new Date();
            } else {
                progress.lectureProgress.push({
                    lectureId,
                    viewed: true,
                    dateViewed: new Date()
                })
            }
            await progress.save()
        }

        const course = await Course.findById(courseId)

        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course Not found.'
            })
        }

        // check all lectures were watched.
        const allLecturesViewed = progress.lectureProgress.length === course.curriculum.length && progress.lectureProgress.every(item => item.viewed)
        // console.log('allLecturesViewed ', allLecturesViewed)

        if (allLecturesViewed) {
            progress.completed = true;
            progress.completionDate = new Date();

            await progress.save()
        }

        res.status(200).json({
            success: true,
            message: 'Lecture marked as completed.',
            data: progress
        })
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
        const { userId, courseId } = req.body;

        const progress = await CourseProgress.findOne({ userId, courseId });

        if (!progress) {
            return res.status(404).json({
                success: false,
                message: 'No course progress.'
            })
        }

        progress.lectureProgress = [];
        progress.completed = false
        progress.completionDate = null

        await progress.save();

        return res.status(200).json({
            success: true,
            message: 'Course progress has been reset.',
            data: progress
        })

    } catch (error) {
        console.log('Error in resetCurrentCourseProgress :', error)
        res.status(500).json({
            success: false,
            message: "Something went wrong."
        })
    }
}

module.exports = { markCurrentLectureAsViewed, resetCurrentCourseProgress, getCurrentCourseProgress }
