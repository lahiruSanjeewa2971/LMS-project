const Order = require("../../models/Order");
const StudentCourses = require("../../models/StudentCourses");


const createOrder = async (req, res) => {
    try {
        const {
            userId,
            userName,
            userEmail,
            orderStatus,
            paymentMethod,
            paymentStatus,
            orderDate,
            paymentId,
            instructorId,
            instructorName,
            courseId,
            courseImage,
            courseTitle,
            coursePricing
        } = req.body;

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

    } catch (error) {
        console.log('Some error occured in capturePayment :', error);
        res.status(500).json({
            success: false,
            message: 'Some error occured.'
        })
    }
}

module.exports = { createOrder, capturePayment }