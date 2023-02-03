const mongoose = require('mongoose')
const ProductSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    categories: {
        type: Array
    },
    size: String,
    color: String,
    price: {
        type: Number,
        required: true
    }
})

const updatedHooks = ['findOneAndUpdate', 'findOneAndDelete', 'findOneAndRemove', 'findOneAndReplace'];
updatedHooks.forEach((key) => {
    ProductSchema.pre(key, async function () {
        let data = await this.model.findOne(this.getQuery());
        // console.log(data);
        this.set({
            __v: data.__v + 1
        })
    })
})

module.exports = mongoose.model('Product', ProductSchema)