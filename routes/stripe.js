const router = require('express').Router()
const stripe = require('stripe')(process.env.STRIPE_KEY);
const stripeController = require('../controller/stripeController')

router.post('/payment',stripeController.payment )


module.exports = router