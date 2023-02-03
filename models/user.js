const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const User = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    age: Number,
    isConfirmed: {
        type: Boolean,
        default: false
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    code: Number,
    isAdmin: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})

//hooks
User.pre('save', async function (next) {
    const hash = bcrypt.hashSync(this.password, parseInt(process.env.saltRounds));
    this.password = hash;
    next();
})
// const updatedHooks = ['findOneAndUpdate', 'findOneAndDelete', 'findOneAndRemove', 'findOneAndReplace'];
// updatedHooks.forEach((key) => {
//     User.pre(key, async function () {
//         let data = await this.model.findOne(this.getQuery());
//         // console.log(data);
//         this.set({
//             __v: data.__v + 1
//         })
//     })
// })

module.exports = mongoose.model('User', User)