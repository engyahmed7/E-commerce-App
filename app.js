const express = require('express')
const app = express()
require('dotenv').config()
const port = process.env.PORT || 5000
const bodyParser = require('body-parser')
const connectDB = require('./connection/connection')
const authRoute = require('./routes/AuthRoute')
const userRoute = require('./routes/UserRoute')
const productRoute = require('./routes/ProductRoute')
const cartRoute = require('./routes/CartRoute')
const orderRoute = require('./routes/OrderRoute')
const path = require('path')



connectDB()
app.use(bodyParser.json())
app.use('/uploads', express.static(path.join(__dirname, './uploads')));


app.use('/api/auth', authRoute)
app.use('/api/user', userRoute)
app.use('/api/product', productRoute)
app.use('/api/cart', cartRoute)
app.use('/api/order', orderRoute)


app.listen(port, () => console.log('> Server is up and running on port : ' + port))