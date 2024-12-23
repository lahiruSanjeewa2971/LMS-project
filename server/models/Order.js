const mongoose = require('mongoose')

const OrderSchema = new mongoose.Schema({
    userId: String,
    userName: String,
    userEmail: String,
    orderStatus: String,
    paymentMethod: String,
    paymentStatus: String,
    orderDate: Date,
    paymentId: String,
    instructorId: String,
    instructorName: String,
    courseId: String,
    courseImage: String,
    courseTitle: String,
    coursePricing: String
})

module.exports = mongoose.model('Order', OrderSchema)