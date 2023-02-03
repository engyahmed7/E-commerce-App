const User = require('../models/user')
const bcrypt = require('bcryptjs')

exports.updateUser = async (req, res) => {
    try {
        let {
            name,
            age,
            password,
            cpassword
        } = req.body;
        const id = req.user._id;

        if (password !== cpassword) {
            res.status(400).json({
                message: "Password and Confirm Password must be same"
            })
        } else {
            if (password) {
                const hash = bcrypt.hashSync(password, parseInt(process.env.saltRounds));
                req.body.password = hash;
            }
            password = req.body.password;
            // console.log(password);
            const userExist = await User.findById(id)
            if (userExist) {
                const updatedUser = await User.findByIdAndUpdate(id, {
                    name,
                    age,
                    password
                }, {
                    new: true
                })
                res.status(200).json({
                    message: "User Updated Successfully",
                    updatedUser
                })
            } else {
                res.status(404).json({
                    message: "User Not Found"
                })
            }
        }
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
            ExtraInfo: error.message
        })
    }
}

exports.deleteUser = async (req, res) => {
    const id = req.user._id;
    try {
        const deleteUser = await User.findByIdAndRemove(id)
        if (deleteUser) {
            res.status(200).json({
                message: "User Deleted Successfully",
                deleteUser
            })
        } else {
            res.status(404).json({
                message: "User Not Found"
            })
        }
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
            ExtraInfo: error.message
        })
    }
}

exports.getUser = async (req, res) => {
    const id = req.user._id;
    try {
        const getUser = await User.findById(id)
        if (getUser) {
            res.status(200).json({
                message: "User Found",
                getUser
            })
        } else {
            res.status(404).json({
                message: "User Not Found"
            })
        }
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
            ExtraInfo: error.message
        })
    }
}

exports.getAllUsers = async (req, res) => {
    try {
        const getAllUsers = await User.find()
        if (getAllUsers) {
            res.status(200).json({
                message: "All Users Found",
                getAllUsers
            })
        } else {
            res.status(404).json({
                message: "No Users Found"
            })
        }
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
            ExtraInfo: error.message
        })
    }
}

exports.getUserStats = async (req, res) => {
    try {
        const date = new Date()
        const lastYear = new Date(date.setFullYear(date.getFullYear() - 1))
        const getUserStats = await User.aggregate([{
                $match: {
                    createdAt: {
                        $gte: lastYear
                    }
                }
            },
            {
                $project: {
                    month: {
                        $month: "$createdAt"
                    }
                }
            },
            {
                $group: {
                    _id: "$month",
                    month: {
                        $first: "$month"
                    },
                    totalUsers: {
                        $sum: 1
                    }

                }
            }
        ])
        if (getUserStats) {
            res.status(200).json({
                message: "User Stats Found",
                getUserStats
            })
        } else {
            res.status(404).json({
                message: "No Users Found"
            })
        }
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
            ExtraInfo: error.message
        })
    }
}