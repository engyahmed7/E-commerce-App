const Cart = require('../models/cart')

exports.addToCart = async (req, res) => {
    try {
        const {
            productId,
            quantity
        } = req.body
        const cart = await Cart.findOne({
            userId: req.user._id
        })
        if (cart) {
            const productExist = cart.products.find((p) => p.productId == productId)
            if (productExist) {
                await Cart.findOneAndUpdate({
                    userId: req.user._id,
                    "products.productId": productId
                }, {
                    $inc: {
                        "products.$.quantity": quantity
                    }
                }, {
                    new: true
                })
            } else {
                await Cart.findOneAndUpdate({
                    userId: req.user._id
                }, {
                    $push: {
                        products: {
                            productId,
                            quantity
                        }
                    }
                }, {
                    new: true
                })
            }
            res.status(200).json({
                success: true,
                message: 'Cart updated successfully',
                cart
            })
        } else {
            const newCart = await Cart.create({
                userId: req.user._id,
                products: [{
                    productId,
                    quantity
                }]
            })
            res.status(200).json({
                success: true,
                message: 'Cart created successfully',
                cart: newCart
            })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            errorMessage: error.message
        })
    }
}

exports.removeFromCart = async (req, res) => {
    try {
        const {
            productId
        } = req.body
        const cart = await Cart.findOneAndUpdate({
            userId: req.user._id
        }, {
            $pull: {
                products: {
                    productId
                }
            }
        }, {
            new: true
        })
        res.status(200).json({
            success: true,
            message: 'Cart updated successfully',
            cart
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            errorMessage: error.message
        })
    }
}

exports.decreaseQuantity = async (req, res) => {    
    try {
        const {
            productId
        } = req.body
        const cart = await Cart.findOne({
            userId: req.user._id
        })
        const product = cart.products.find((p) => p.productId == productId)
        if (product.quantity == 1) {
            await Cart.findOneAndUpdate({
                userId: req.user._id
            }, {
                $pull: {
                    products: {
                        productId
                    }
                }
            }, {
                new: true
            })
        } else {
            await Cart.findOneAndUpdate({
                userId: req.user._id,
                "products.productId": productId
            }, {
                $inc: {
                    "products.$.quantity": -1
                }
            }, {
                new: true
            })
        }
        res.status(200).json({
            success: true,
            message: 'Cart updated successfully',
            cart
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            errorMessage: error.message
        })
    }
}

exports.increaseQuantity = async (req, res) => {
    try {
        const {
            productId
        } = req.body
        await Cart.findOneAndUpdate({
            userId: req.user._id,
            "products.productId": productId
        }, {
            $inc: {
                "products.$.quantity": 1
            }
        }, {
            new: true
        })
        res.status(200).json({
            success: true,
            message: 'Cart updated successfully',
            cart
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            errorMessage: error.message
        })
    }
}

exports.getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({
            userId: req.user._id
        }).populate('products.productId', 'name price image')
        res.status(200).json({
            success: true,
            cart
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            errorMessage: error.message
        })
    }
}
