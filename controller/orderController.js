const Order = require('../models/order')
const Cart = require('../models/cart')

exports.addOrder = async (req, res) => {
    try {
        const cart = await Cart.findOne({
            userId: req.user._id
        }).populate('products.productId')
        if (!cart) {
            return res.status(400).json({
                success: false,
                message: 'Cart not found'
            })
        }
        let totalPrice = 0
        cart.products.forEach(product => {
            totalPrice += product.productId.price * product.quantity
        })
        const order = new Order({
            userId: req.user._id,
            products: cart.products,
            totalPrice,
            address: req.body.address
        })
        await order.save()
        //empty cart
        await Cart.findOneAndUpdate({
            userId: req.user._id
        }, {
            $set: {
                products: []
            }
        })
        res.status(200).json({
            success: true,
            message: 'Order placed successfully'
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}

exports.getOrders = async (req, res) => {
    try {
        const orders = await Order.find({
            userId: req.user._id
        }).populate('products.productId')
        res.status(200).json({
            success: true,
            orders
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}

exports.payment = async (req, res) => {
    
}