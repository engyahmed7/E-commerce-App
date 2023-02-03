const router = require('express').Router()
const orderController = require('../controller/orderController')
const {
    auth,
    admin
} = require('../middleware/is-auth')

router.post('/add', auth(), orderController.addOrder)
router.get('/get', auth(), orderController.getOrders)
//payment
router.post('/payment', auth(), orderController.payment)

module.exports = router;