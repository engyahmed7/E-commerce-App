const Product = require('../models/product')

exports.addProduct = async (req, res) => {
    try {
        const {
            title,
            description,
            categories,
            size,
            color,
            price
        } = req.body;

        const product = await Product.findOne({
            title
        })
        if (product) {
            res.status(400).json({
                message: "Product already exists"
            })
        } else {

            if (req.fileUploadError) {
                res.json({
                    message: 'invalid file, accepted files->(png,jpg,jpeg)'
                })
            }

            const Url = `${req.protocol}://${req.headers.host}/${req.destination}/${req.file.filename}`
            const newProduct = new Product({
                title,
                description,
                image: Url,
                categories,
                size,
                color,
                price
            })
            const savedProduct = await newProduct.save()
            res.status(201).json({
                message: "Product added successfully",
                savedProduct
            })
        }
        // const addedProduct = new Product(req.body)
        // const savedProduct = await addedProduct.save()
        // res.status(201).json({
        //     message: "Product added successfully",
        //     savedProduct
        // })

    } catch (err) {
        res.status(500).json({
            message: "Something went wrong",
            ExtraInfo: err.message
        })
    }
}

exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find()
        res.status(200).json({
            message: "All products",
            products
        })
    } catch (err) {
        res.status(500).json({
            message: "Something went wrong",
            ExtraInfo: err.message
        })
    }
}

exports.deleteProduct = async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id)
        res.status(200).json({
            message: "Product deleted successfully",
            deletedProduct
        })
    } catch (err) {
        res.status(500).json({
            message: "Something went wrong",
            ExtraInfo: err.message
        })
    }
}