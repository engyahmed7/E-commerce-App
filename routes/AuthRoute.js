const router = require('express').Router()
const authController = require('../controller/authController')
const validationFunction = require('../middleware/validationFun')
const {
    signUpValidation,
    signInValidation,
    ResetPasswordValidation
} = require('../validation/authValidation')

router.post('/register', validationFunction(signUpValidation), authController.register)

router.get('/confirm/:token', validationFunction(signInValidation), authController.confirmEmail)

router.get('/re-sendToken/:id', authController.ResendToken)
//reconfirm email
router.get('/reconfirm/:token', authController.reconfirmEmail)

router.post('/login', authController.login)

//send Code to reset password
router.post('/sendCode', authController.sendCode)

//reset password
router.patch('/resetPassword', validationFunction(ResetPasswordValidation), authController.resetPassword)


module.exports = router