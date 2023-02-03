const router = require('express').Router()
const userController = require('../controller/userController')
const {
    auth,
    admin
} = require('../middleware/is-auth')


router.put('/updateUser', auth(), userController.updateUser)
router.delete('/delete', auth(), userController.deleteUser)
//get user
router.get('/getuser', auth(), userController.getUser)

//get all users
router.get('/getallusers', userController.getAllUsers)

//get user stats
router.get('/stats', admin(), userController.getUserStats)

module.exports = router