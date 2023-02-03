const stripe = require('stripe')(process.env.STRIPE_KEY);

exports.payment = async (req, res) => {
    // try {
    //     const {
    //         amount,
    //         id
    //     } = req.body;
    //     const payment = await stripe.paymentIntents.create({
    //         amount,
    //         currency: "USD",
    //         description: "Ecommerce",
    //         payment_method: id,
    //         confirm: true
    //     })
    //     console.log(payment)
    //     res.status(200).json({
    //         success: true,
    //         message: 'Payment successful'
    //     })
    // } catch (error) {
    //     console.log(error)
    //     res.status(500).json({
    //         success: false,
    //         message: 'Internal server error'
    //     })
    // }

    stripe.charges.create({
            amount: req.body.amount,
            currency: "usd",
            source: req.body.token.id,
        },
        function (err, charge) {
            if (err) {
                return res.status(500).send({
                    error: err.message
                });
            }
            res.status(200).send({
                success: charge
            });
        }
    )

}