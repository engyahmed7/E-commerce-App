const router = require('express').Router()
const authController = require('../controller/authController')

router.post('/register', authController.register)

router.get('/confirm/:token', authController.confirmEmail)

router.get('/re-sendToken/:id', authController.ResendToken)
//reconfirm email
router.get('/reconfirm/:token', authController.reconfirmEmail)

router.post('/login', authController.login)

//send Code to reset password
router.post('/sendCode', authController.sendCode)

//reset password
router.patch('/resetPassword', authController.resetPassword)


module.exports = router