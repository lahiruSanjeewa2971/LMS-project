const express = require('express');
const { capturePayment, createOrder } = require('../../controllers/student-controller/order-controller')

const router = express.Router()

router.post('/create', createOrder)
router.post('/capture', capturePayment)

module.exports = router
