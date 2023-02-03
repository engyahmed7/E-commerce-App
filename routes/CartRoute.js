const router = require('express').Router()
const cartController = require('../controller/cartController')
const {
    auth,
    admin
} = require('../middleware/is-auth')


router.get('/', auth(), cartController.getCart)
router.post('/add', auth(), cartController.addToCart)
router.post('/remove', auth(), cartController.removeFromCart)
router.patch('/decrease', auth(), cartController.decreaseQuantity)
router.patch('/increase', auth(), cartController.increaseQuantity)


module.exports = router