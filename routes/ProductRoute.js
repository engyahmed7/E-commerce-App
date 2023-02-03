const router = require('express').Router()
const productController = require('../controller/productController')
const {
    auth,
    admin
} = require('../middleware/is-auth')

const {
    multerFn,
    validationType,
    multerHandelErrors
} = require('../services/multer')

router.get('/', productController.getAllProducts)
router.post('/addProduct', admin(), multerFn('/Products', validationType.image).single('image'), multerHandelErrors, productController.addProduct)
//delete product
router.delete('/deleteProduct/:id', admin(), productController.deleteProduct)


module.exports = router