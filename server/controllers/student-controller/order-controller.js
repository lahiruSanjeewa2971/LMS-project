const Course = require("../../models/Course");
const Order = require("../../models/Order");
const StudentCourses = require("../../models/StudentCourses");

const createOrder = async (req, res) => {
    try {
        const {
            userId, userName, userEmail, orderStatus, paymentMethod, paymentStatus, orderDate, paymentId, instructorId, instructorName, courseId, courseImage, courseTitle, coursePricing
        } = req.body;

        const newlyCreateCourseOrder = new Order({
            userId, userName, userEmail, orderStatus, paymentMethod, paymentStatus, orderDate, paymentId, instructorId, instructorName, courseId, courseImage, courseTitle, coursePricing
        });

        await newlyCreateCourseOrder.save();

        res.status(201).json({
            success: true,
            data: {
                orderId: newlyCreateCourseOrder._id
            }
        })

    } catch (error) {
        console.log('Some error occured in createOrder :', error);
        res.status(500).json({
            success: false,
            message: 'Some error occured.'
        })
    }
}

const capturePayment = async (req, res) => {
    try {
        const { paymentId, payerId, orderId } = req.body;

        let order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order cannot be found.'
            })
        }

        order.paymentStatus = 'paid';
        order.orderStatus = 'confirmed';
        order.paymentId = paymentId;
        order.payerId = payerId

        await order.save();

        // update student course model
        const studentCourses = await StudentCourses.findOne({ userId: order.userId })

        if (studentCourses) {
            // const { courses } = studentCourses;
            // courses.map((single) => {
            //     if (single.courseId === order.courseId) {
            //         return res.status(400).json({
            //             success: false,
            //             message: 'Student already buy this course.'
            //         })
            //     }
            // })

            /**
             // above comment reason. .map
             *  map does not stop further execution, and the function continues to try to send more responses later.
             */

            // Check if student already purchased the course.
            const courseAlreadyExists = studentCourses.courses.some(
                (single) => single.courseId.toString() === order.courseId.toString()
            );

            if (courseAlreadyExists) {
                return res.status(400).json({
                    success: false,
                    message: "Student already bought this course.",
                });
            }
        }

        if (studentCourses) {
            studentCourses.courses.push({
                courseId: order.courseId,
                title: order.courseTitle,
                instructorId: order.instructorId,
                instructorName: order.instructorName,
                dateOfPurchase: order.orderDate,
                courseImage: order.courseImage
            })

            await studentCourses.save();
        } else {
            const newStudentCourse = new StudentCourses({
                userId: order.userId,
                courses: [{
                    courseId: order.courseId,
                    title: order.courseTitle,
                    instructorId: order.instructorId,
                    instructorName: order.instructorName,
                    dateOfPurchase: order.orderDate,
                    courseImage: order.courseImage
                }]
            })

            await newStudentCourse.save();
        }

        // update course model to save student under a course
        await Course.findOneAndUpdate({ _id: order.courseId }, {
            $addToSet: {
                students: {
                    studentId: order.userId,
                    studentName: order.userName,
                    studentEmail: order.userEmail,
                    paidAmount: order.coursePricing
                }
            }
        })

        res.status(200).json({
            success: true,
            message: 'Order confirmed.',
            data: order
        })

    } catch (error) {
        console.log('Some error occured in capturePayment :', error);
        res.status(500).json({
            success: false,
            message: 'Some error occured.'
        })
    }
}

module.exports = { createOrder, capturePayment }